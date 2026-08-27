import {
  calcularTotales,
  computeMontoItem,
  computeTotalesCategorizados,
  LineaCalculable,
  resolveTasaItbis,
} from './totales.util';
import { IndicadorFacturacion } from '../../factura/enums/indicador-facturacion.enum';

function linea(
  cantidad: number,
  precioUnitario: number,
  opciones: {
    descuento?: number;
    tasa?: number;
    indicadorFacturacion?: number | null;
  } = {},
): LineaCalculable {
  const { descuento = 0, tasa = 0.18 } = opciones;
  const base = cantidad * precioUnitario - descuento;
  return {
    cantidad: String(cantidad),
    precioUnitario: String(precioUnitario),
    itbis: (Math.round(base * tasa * 100) / 100).toFixed(2),
    descuento: descuento ? descuento.toFixed(2) : null,
    ...('indicadorFacturacion' in opciones
      ? { indicadorFacturacion: opciones.indicadorFacturacion }
      : {}),
  };
}

describe('computeMontoItem', () => {
  it('is cantidad x precio unitario menos el descuento de linea', () => {
    expect(computeMontoItem(linea(2, 500))).toBe(1000);
    expect(computeMontoItem(linea(2, 500, { descuento: 100 }))).toBe(900);
  });
});

describe('resolveTasaItbis', () => {
  it('prefers the line indicador when it carries one', () => {
    expect(
      resolveTasaItbis(
        linea(1, 100, { indicadorFacturacion: IndicadorFacturacion.ITBIS_16 }),
      ),
    ).toBe(0.16);
    expect(
      resolveTasaItbis(
        linea(1, 100, {
          tasa: 0,
          indicadorFacturacion: IndicadorFacturacion.EXENTO,
        }),
      ),
    ).toBe(0);
  });

  it('falls back to the standard rate when the line is unclassified', () => {
    expect(resolveTasaItbis(linea(1, 100))).toBe(0.18);
    expect(resolveTasaItbis(linea(1, 100, { tasa: 0 }))).toBe(0);
  });

  /**
   * Rows written before per-line discounts were factored into `itbis` stored a
   * gross-based amount. Deriving the rate from `itbis / monto` would inflate it;
   * this asserts those rows still resolve to the true 18%.
   */
  it('is not skewed by a legacy itbis computed on the gross amount', () => {
    const legacy: LineaCalculable = {
      cantidad: '1',
      precioUnitario: '1000',
      itbis: '180.00', // 18% of 1000, ignoring the 100 discount
      descuento: '100.00',
    };
    expect(resolveTasaItbis(legacy)).toBe(0.18);
  });
});

describe('computeTotalesCategorizados', () => {
  it('caps an oversized discount at the base instead of going negative', () => {
    const totales = computeTotalesCategorizados([linea(1, 1000)], '1500');
    expect(totales.descuentoGlobal).toBe(1000);
    expect(totales.montoGravadoTotal).toBe(0);
    expect(totales.montoTotal).toBe(0);
  });

  it('ignores a discount when nothing is discountable', () => {
    const totales = computeTotalesCategorizados([], '50');
    expect(totales.descuentoGlobal).toBe(0);
    expect(totales.montoTotal).toBe(0);
  });

  /** The commercial path clamps; only callers that opt in (the e-CF) reject. */
  it('reports why a discount could not be applied when asked to', () => {
    const motivos: string[] = [];
    expect(() =>
      computeTotalesCategorizados([linea(1, 1000)], '1500', {
        onDescuentoInvalido: (motivo) => {
          motivos.push(motivo);
          throw new Error(motivo);
        },
      }),
    ).toThrow('excede');
    expect(motivos).toEqual(['excede']);
  });

  it('buckets an unclassified line by whether it carries ITBIS', () => {
    const gravada = computeTotalesCategorizados([linea(1, 1000)], null);
    expect(gravada.montoGravadoTotal).toBe(1000);
    expect(gravada.totalItbis).toBe(180);

    const sinItbis = computeTotalesCategorizados(
      [linea(1, 1000, { tasa: 0 })],
      null,
    );
    expect(sinItbis.totalItbis).toBe(0);
    expect(sinItbis.montoTotal).toBe(1000);
  });
});

describe('calcularTotales', () => {
  it('leaves an undiscounted invoice at subtotal + itbis', () => {
    const totales = calcularTotales([linea(1, 1000)], null);
    expect(totales).toEqual({ subtotal: 1000, itbisTotal: 180, total: 1180 });
  });

  /** The worked case from the plan: the discount comes off the base, not the bottom line. */
  it('applies a global discount to the taxable base before ITBIS', () => {
    const totales = calcularTotales([linea(1, 1000)], '100');
    expect(totales).toEqual({ subtotal: 1000, itbisTotal: 162, total: 1062 });
  });

  it('charges ITBIS on the line amount net of a per-line descuento', () => {
    const totales = calcularTotales([linea(1, 1000, { descuento: 100 })], null);
    expect(totales).toEqual({ subtotal: 900, itbisTotal: 162, total: 1062 });
  });

  it('combines per-line and global discounts', () => {
    // base 900 after the line discount, 810 after the 90 global discount
    const totales = calcularTotales([linea(1, 1000, { descuento: 100 })], '90');
    expect(totales).toEqual({ subtotal: 900, itbisTotal: 145.8, total: 955.8 });
  });

  it('excludes untaxed lines from ITBIS but keeps them in the subtotal', () => {
    const totales = calcularTotales(
      [linea(1, 1000), linea(1, 500, { tasa: 0 })],
      null,
    );
    expect(totales).toEqual({ subtotal: 1500, itbisTotal: 180, total: 1680 });
  });

  it('spreads a global discount across lines in proportion to their amount', () => {
    // 200/300/130 of 630, discount 100 -> bases shrink to 530/630 of each
    const totales = calcularTotales(
      [linea(1, 200), linea(1, 300), linea(1, 130)],
      '100',
    );
    expect(totales.subtotal).toBe(630);
    expect(totales.itbisTotal).toBeCloseTo(95.4, 2); // 530 x 0.18
    expect(totales.total).toBeCloseTo(625.4, 2);
  });

  it('drops ITBIS to zero when the discount swallows the subtotal', () => {
    const totales = calcularTotales([linea(1, 1000)], '1000');
    expect(totales.itbisTotal).toBe(0);
    expect(totales.total).toBe(0);
  });

  it('survives a zero-priced line without dividing by zero', () => {
    const totales = calcularTotales([linea(1, 0, { tasa: 0 })], null);
    expect(totales).toEqual({ subtotal: 0, itbisTotal: 0, total: 0 });
  });

  it('treats a null/absent descuentoGlobal as none', () => {
    const sinDescuento = calcularTotales([linea(1, 1000)], null);
    expect(calcularTotales([linea(1, 1000)], undefined)).toEqual(sinDescuento);
    expect(calcularTotales([linea(1, 1000)], '')).toEqual(sinDescuento);
  });
});
