import { BadRequestException } from '@nestjs/common';
import { EcfXmlBuilderService } from './ecf-xml-builder.service';
import { computeTotalesEcf, UMBRAL_RFCE } from './ecf-xml.util';
import { IndicadorFacturacion } from '../factura/enums/indicador-facturacion.enum';
import { TipoECF } from '../factura/enums/tipo-ecf.enum';
import {
  childOrder,
  elementText,
  makeCliente,
  makeEmpresa,
  makeFactura,
  makeLinea,
} from './ecf-test.fixtures';

describe('EcfXmlBuilderService', () => {
  const builder = new EcfXmlBuilderService();
  const empresa = makeEmpresa();
  const VENCIMIENTO_SECUENCIA = '2027-12-31';

  function build(factura = makeFactura([makeLinea(1000)])) {
    return builder.build(
      factura,
      empresa,
      'E310000000001',
      VENCIMIENTO_SECUENCIA,
    );
  }

  /**
   * Formato Comprobante Fiscal Electronico V1.0, field 10 (pg. 8):
   * "Solo para facturas a credito. Condicional a que el tipo de pago sea a
   * credito", validacion b) "Fecha limite de pago debe ser >= Fecha de emision".
   */
  describe('FechaLimitePago', () => {
    it('is emitted for a credit invoice, right after TipoPago', () => {
      const xml = build(
        makeFactura([makeLinea(1000)], { fechaVencimiento: '2026-09-30' }),
      );

      expect(elementText(xml, 'TipoPago')).toBe('2');
      expect(elementText(xml, 'FechaLimitePago')).toBe('30-09-2026');

      const orden = childOrder(xml, 'IdDoc');
      expect(orden.indexOf('FechaLimitePago')).toBe(
        orden.indexOf('TipoPago') + 1,
      );
    });

    it('is omitted for a cash invoice', () => {
      const xml = build(makeFactura([makeLinea(1000)]));

      expect(elementText(xml, 'TipoPago')).toBe('1');
      expect(xml).not.toContain('<FechaLimitePago>');
    });

    it('rejects a due date earlier than the emission date', () => {
      expect(() =>
        build(
          makeFactura([makeLinea(1000)], {
            fechaEmision: '2026-08-27',
            fechaVencimiento: '2026-08-01',
          }),
        ),
      ).toThrow(BadRequestException);
    });

    it('accepts a due date equal to the emission date', () => {
      const xml = build(
        makeFactura([makeLinea(1000)], {
          fechaEmision: '2026-08-27',
          fechaVencimiento: '2026-08-27',
        }),
      );
      expect(elementText(xml, 'FechaLimitePago')).toBe('27-08-2026');
    });
  });

  /**
   * Formato field 38, validacion b) (pg. 12): "Si el e-CF es tipo 32 y el monto
   * total es >= DOP$250,000.00 se debe identificar RNC Comprador".
   */
  describe('identificacion del comprador', () => {
    function facturaConsumo(monto: number, rnc: string | null) {
      return makeFactura([makeLinea(monto)], {
        tipoECF: TipoECF.CONSUMO,
        cliente: makeCliente(rnc),
      });
    }

    it('rejects a tipo-32 invoice at or above RD$250,000 with no RNC', () => {
      // 250,000 gravado + ITBIS clears the threshold comfortably
      expect(() => build(facturaConsumo(250000, null))).toThrow(
        /no tiene RNC\/cedula registrado/,
      );
    });

    it('accepts the same invoice once the buyer is identified', () => {
      const xml = build(facturaConsumo(250000, '130862346'));
      expect(elementText(xml, 'RNCComprador')).toBe('130862346');
    });

    it('allows an anonymous buyer below the threshold', () => {
      const factura = facturaConsumo(1000, null);
      expect(computeTotalesEcf(factura).montoTotal).toBeLessThan(UMBRAL_RFCE);

      const xml = build(factura);
      expect(xml).not.toContain('<RNCComprador>');
      expect(elementText(xml, 'RazonSocialComprador')).toBe(
        'Cliente de Prueba SRL',
      );
    });

    it('still requires an RNC for tipo 31 at any amount', () => {
      expect(() =>
        build(makeFactura([makeLinea(100)], { cliente: makeCliente(null) })),
      ).toThrow(/tipo 31/);
    });
  });

  /**
   * Formato field 111 (pg. 26): reported when any line carries
   * IndicadorFacturacion=0, and outside MontoTotal.
   */
  describe('MontoNoFacturable', () => {
    it('is emitted directly after MontoTotal when such a line exists', () => {
      const xml = build(
        makeFactura([
          makeLinea(1000),
          makeLinea(250, IndicadorFacturacion.NO_FACTURABLE),
        ]),
      );

      expect(elementText(xml, 'MontoNoFacturable')).toBe('250.00');
      expect(elementText(xml, 'MontoTotal')).toBe('1180.00');

      const orden = childOrder(xml, 'Totales');
      expect(orden.indexOf('MontoNoFacturable')).toBe(
        orden.indexOf('MontoTotal') + 1,
      );
    });

    it('is omitted when every line is billable', () => {
      expect(build()).not.toContain('<MontoNoFacturable>');
    });
  });

  /** Formato field 110 (pg. 25): MontoTotal is a sum, never a discounted figure. */
  describe('cuadratura del XML emitido', () => {
    it.each([
      ['sin descuento', null],
      ['con descuento global', '100.00'],
    ])('holds %s', (_caso, descuentoGlobal) => {
      const xml = build(
        makeFactura(
          [
            makeLinea(1000, IndicadorFacturacion.ITBIS_18),
            makeLinea(500, IndicadorFacturacion.ITBIS_16),
            makeLinea(200, IndicadorFacturacion.EXENTO),
          ],
          { descuentoGlobal },
        ),
      );

      const monto = (tag: string) =>
        parseFloat(elementText(xml, tag) ?? '0') || 0;

      expect(monto('MontoTotal')).toBeCloseTo(
        monto('MontoGravadoTotal') + monto('MontoExento') + monto('TotalITBIS'),
        2,
      );
      expect(monto('TotalITBIS1')).toBeCloseTo(
        monto('MontoGravadoI1') * 0.18,
        2,
      );
      expect(monto('TotalITBIS2')).toBeCloseTo(
        monto('MontoGravadoI2') * 0.16,
        2,
      );
    });

    it('reports amounts already net of the global discount', () => {
      const xml = build(
        makeFactura([makeLinea(1000)], { descuentoGlobal: '100.00' }),
      );

      expect(elementText(xml, 'MontoGravadoI1')).toBe('900.00');
      expect(elementText(xml, 'TotalITBIS1')).toBe('162.00');
      expect(elementText(xml, 'MontoTotal')).toBe('1062.00');
    });

    it('keeps DescuentosORecargos consistent with the totals', () => {
      const xml = build(
        makeFactura(
          [
            makeLinea(1000, IndicadorFacturacion.ITBIS_18),
            makeLinea(500, IndicadorFacturacion.ITBIS_16),
          ],
          { descuentoGlobal: '150.00' },
        ),
      );

      const montos = [...xml.matchAll(/<MontoDescuentooRecargo>([^<]+)</g)].map(
        (m) => parseFloat(m[1]),
      );
      expect(montos).toHaveLength(2);
      expect(montos.reduce((a, b) => a + b, 0)).toBeCloseTo(150, 2);
      // More than one tax category present -> TipoValor must be '%'
      expect(xml).toContain('<TipoValor>%</TipoValor>');
    });

    it('uses a flat amount when a single tax category is present', () => {
      const xml = build(
        makeFactura([makeLinea(1000)], { descuentoGlobal: '100.00' }),
      );
      expect(xml).toContain('<TipoValor>$</TipoValor>');
      expect(elementText(xml, 'MontoDescuentooRecargo')).toBe('100.00');
      expect(xml).not.toContain('<ValorDescuentooRecargo>');
    });
  });
});
