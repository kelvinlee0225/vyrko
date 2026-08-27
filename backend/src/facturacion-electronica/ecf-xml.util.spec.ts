import { BadRequestException } from '@nestjs/common';
import { computeTotalesEcf, INDICADORES_DESCONTABLES } from './ecf-xml.util';
import { IndicadorFacturacion } from '../factura/enums/indicador-facturacion.enum';
import {
  calcularTotales,
  resolveTasaItbis,
} from '../common/totales/totales.util';
import { INDICADOR_NO_FACTURABLE } from '../common/totales/totales.util';
import { makeFactura, makeLinea } from './ecf-test.fixtures';

describe('computeTotalesEcf', () => {
  describe('cuadratura (Formato field 110)', () => {
    /**
     * MontoTotal = MontoGravadoTotal + MontoExento + Total ITBIS + Monto del
     * Impuesto adicional, with nothing subtracted at that level. This is the
     * invariant the old code broke by taking the discount off MontoTotal.
     */
    it.each([
      ['sin descuento', null],
      ['con descuento global', '100.00'],
      ['con descuento que cruza categorias', '250.00'],
    ])('holds %s', (_caso, descuentoGlobal) => {
      const totales = computeTotalesEcf(
        makeFactura(
          [
            makeLinea(1000, IndicadorFacturacion.ITBIS_18),
            makeLinea(500, IndicadorFacturacion.ITBIS_16),
            makeLinea(300, IndicadorFacturacion.ITBIS_0),
            makeLinea(200, IndicadorFacturacion.EXENTO),
          ],
          { descuentoGlobal },
        ),
      );

      expect(totales.montoTotal).toBeCloseTo(
        totales.montoGravadoTotal + totales.montoExento + totales.totalItbis,
        2,
      );
    });
  });

  /** TotalITBIS Tasa n = Monto Gravado ITBIS tasa n x ITBIS tasa (Formato field 101). */
  it('derives every TotalITBIS from its discounted base', () => {
    const totales = computeTotalesEcf(
      makeFactura(
        [
          makeLinea(1000, IndicadorFacturacion.ITBIS_18),
          makeLinea(500, IndicadorFacturacion.ITBIS_16),
        ],
        { descuentoGlobal: '150.00' },
      ),
    );

    for (const categoria of totales.categorias) {
      expect(categoria.totalItbis).toBeCloseTo(
        categoria.montoGravado * categoria.tasa,
        2,
      );
    }
  });

  it('takes the discount off the base, not the bottom line', () => {
    const totales = computeTotalesEcf(
      makeFactura([makeLinea(1000, IndicadorFacturacion.ITBIS_18)], {
        descuentoGlobal: '100.00',
      }),
    );

    expect(totales.montoGravadoTotal).toBe(900);
    expect(totales.totalItbis).toBe(162);
    expect(totales.montoTotal).toBe(1062);
  });

  it('charges ITBIS net of a per-line descuento', () => {
    const totales = computeTotalesEcf(
      makeFactura([makeLinea(1000, IndicadorFacturacion.ITBIS_18, 100)]),
    );

    expect(totales.montoGravadoTotal).toBe(900);
    expect(totales.totalItbis).toBe(162);
  });

  describe('allocation of the global discount', () => {
    it('sums to the discount exactly, remainder on the last category', () => {
      const descuentoGlobal = 100;
      const totales = computeTotalesEcf(
        makeFactura(
          [
            makeLinea(200, IndicadorFacturacion.ITBIS_18),
            makeLinea(300, IndicadorFacturacion.ITBIS_16),
            makeLinea(130, IndicadorFacturacion.EXENTO),
          ],
          { descuentoGlobal: descuentoGlobal.toFixed(2) },
        ),
      );

      const asignado = totales.categorias.reduce(
        (suma, categoria) => suma + categoria.descuentoAsignado,
        0,
      );
      expect(asignado).toBeCloseTo(descuentoGlobal, 2);
    });

    it('is proportional to each category share of the pre-discount base', () => {
      const totales = computeTotalesEcf(
        makeFactura(
          [
            makeLinea(200, IndicadorFacturacion.ITBIS_18),
            makeLinea(600, IndicadorFacturacion.ITBIS_16),
          ],
          { descuentoGlobal: '80.00' },
        ),
      );

      const tasa18 = totales.porIndicador.get(IndicadorFacturacion.ITBIS_18)!;
      const tasa16 = totales.porIndicador.get(IndicadorFacturacion.ITBIS_16)!;
      expect(tasa18.descuentoAsignado).toBeCloseTo(20, 2); // 200/800 x 80
      expect(tasa16.descuentoAsignado).toBeCloseTo(60, 2); // 600/800 x 80
    });

    /** Formato pg. 48 seccion D b) 3 scopes the discount to codigos 1, 2, 3, 4. */
    it('never touches No Facturable lines', () => {
      const totales = computeTotalesEcf(
        makeFactura(
          [
            makeLinea(1000, IndicadorFacturacion.ITBIS_18),
            makeLinea(400, IndicadorFacturacion.NO_FACTURABLE),
          ],
          { descuentoGlobal: '100.00' },
        ),
      );

      expect(totales.montoNoFacturable).toBe(400);
      expect(
        totales.categorias.some((c) => c.indicador === INDICADOR_NO_FACTURABLE),
      ).toBe(false);
      // The whole discount landed on the only discountable category.
      expect(totales.montoGravadoTotal).toBe(900);
    });
  });

  describe('MontoNoFacturable (Formato field 111)', () => {
    it('reports indicador-0 lines outside MontoTotal', () => {
      const totales = computeTotalesEcf(
        makeFactura([
          makeLinea(1000, IndicadorFacturacion.ITBIS_18),
          makeLinea(250, IndicadorFacturacion.NO_FACTURABLE),
        ]),
      );

      expect(totales.montoNoFacturable).toBe(250);
      expect(totales.montoTotal).toBe(1180); // 1000 + 180, the 250 excluded
    });

    it('is zero when no such line exists', () => {
      const totales = computeTotalesEcf(
        makeFactura([makeLinea(1000, IndicadorFacturacion.ITBIS_18)]),
      );
      expect(totales.montoNoFacturable).toBe(0);
    });
  });

  describe('rejections', () => {
    it('refuses a line with no indicador de facturacion', () => {
      const linea = makeLinea(1000, IndicadorFacturacion.ITBIS_18);
      linea.indicadorFacturacion = null;

      expect(() => computeTotalesEcf(makeFactura([linea]))).toThrow(
        BadRequestException,
      );
    });

    it('refuses a discount that reaches or exceeds the gravado', () => {
      const lineas = [makeLinea(1000, IndicadorFacturacion.ITBIS_18)];
      expect(() =>
        computeTotalesEcf(makeFactura(lineas, { descuentoGlobal: '1000.00' })),
      ).toThrow(/iguala o supera el monto gravado/);
      expect(() =>
        computeTotalesEcf(makeFactura(lineas, { descuentoGlobal: '1500.00' })),
      ).toThrow(BadRequestException);
    });

    it('refuses a discount with nothing discountable to apply it to', () => {
      expect(() =>
        computeTotalesEcf(
          makeFactura([makeLinea(500, IndicadorFacturacion.NO_FACTURABLE)], {
            descuentoGlobal: '50.00',
          }),
        ),
      ).toThrow(/ninguna linea facturable/);
    });
  });

  /**
   * Guards against the two rate tables drifting: common/totales declares its own
   * copy keyed by plain number so `common` need not import a feature enum.
   */
  it('agrees with the commercial rate table for every indicador', () => {
    for (const indicador of INDICADORES_DESCONTABLES) {
      const totales = computeTotalesEcf(
        makeFactura([makeLinea(1000, indicador)]),
      );
      expect(totales.categorias[0].tasa).toBe(
        resolveTasaItbis(makeLinea(1000, indicador)),
      );
    }
  });
});

/**
 * The whole point of aligning the app to DGII: the invoice the customer is
 * billed and the e-CF filed for it must be the same number.
 */
describe('commercial totals vs e-CF totals', () => {
  it.each([
    ['sin descuentos', null, 0],
    ['con descuento global', '100.00', 0],
    ['con descuento de linea', null, 75],
    ['con ambos descuentos', '120.00', 75],
  ])('agree %s', (_caso, descuentoGlobal, descuentoLinea) => {
    const lineas = [
      makeLinea(1000, IndicadorFacturacion.ITBIS_18, descuentoLinea),
      makeLinea(500, IndicadorFacturacion.ITBIS_16),
      makeLinea(200, IndicadorFacturacion.EXENTO),
    ];
    const factura = makeFactura(lineas, {
      descuentoGlobal: descuentoGlobal,
    });

    expect(calcularTotales(lineas, descuentoGlobal).total).toBe(
      computeTotalesEcf(factura).montoTotal,
    );
  });
});
