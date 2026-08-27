/**
 * The one place invoice/quote amounts are computed, shared by Factura,
 * Cotizacion and the e-CF builders.
 *
 * DGII treats a global discount as reducing the taxable base, not the final
 * amount: "Descuentos o Recargos ... aumentan o disminuyen la base del
 * impuesto" (Formato Comprobante Fiscal Electronico V1.0, pg. 48, seccion D),
 * with `MontoTotal = MontoGravadoTotal + MontoExento + Total ITBIS + Monto del
 * Impuesto adicional` (field 110) and nothing subtracted at that level.
 *
 * The app bills on the same model so the invoice a customer pays and the e-CF
 * filed for it are the same number — down to the cent, which is why the
 * per-category bucketing and rounding live here rather than being reimplemented
 * per caller. facturacion-electronica/ecf-xml.util.ts wraps this with the
 * Factura types and DGII's error messages.
 */

/**
 * Structural shape both FacturaLinea and CotizacionLinea satisfy; declared here
 * rather than importing either so this stays usable from both modules.
 */
export interface LineaCalculable {
  cantidad: string;
  precioUnitario: string;
  itbis: string;
  descuento: string | null;
  /**
   * DGII IndicadorFacturacion code when the line carries one (FacturaLinea
   * does, CotizacionLinea does not). Typed as a plain number to keep `common`
   * free of a feature module's enum; ecf-xml.util.spec.ts asserts the two rate
   * tables agree for every code.
   */
  indicadorFacturacion?: number | null;
}

/** Mirrors factura/enums/indicador-facturacion.enum.ts. */
export const INDICADOR_NO_FACTURABLE = 0;
const INDICADOR_ITBIS_18 = 1;
const INDICADOR_ITBIS_0 = 3;
const INDICADOR_EXENTO = 4;

/**
 * Categories a global discount is spread across, in the XSD's own order.
 * Excludes No Facturable (0) per Formato pg. 48, seccion D, b) 3: "Si el
 * descuento afecta a todos (Indicador de Facturacion codigos 1, 2, 3, 4),
 * debera haber tantas lineas como conceptos existan".
 */
export const INDICADORES_DESCONTABLES = [1, 2, 3, 4];

const TASA_POR_INDICADOR: Record<number, number> = {
  0: 0,
  1: 0.18,
  2: 0.16,
  3: 0,
  4: 0,
};

/** Aggregate amounts for one tax category, before and after the global discount. */
export interface CategoriaTotales {
  indicador: number;
  tasa: number;
  /** Sum of MontoItem for this category, before the global discount. */
  montoGravadoBruto: number;
  /** This category's share of the global discount. */
  descuentoAsignado: number;
  /** montoGravadoBruto - descuentoAsignado; what the e-CF actually carries. */
  montoGravado: number;
  /** montoGravado x tasa, per Formato field 101. */
  totalItbis: number;
}

export interface TotalesCategorizados {
  /** Categories with a non-zero base, in INDICADORES_DESCONTABLES order. */
  categorias: CategoriaTotales[];
  porIndicador: Map<number, CategoriaTotales>;
  descuentoGlobal: number;
  /** MontoGravadoI1 + I2 + I3, net of the discount (Formato field 92). */
  montoGravadoTotal: number;
  montoExento: number;
  totalItbis: number;
  /** MontoGravadoTotal + MontoExento + TotalITBIS (Formato field 110). */
  montoTotal: number;
  /** Sum of indicador-0 lines; never discounted, never part of MontoTotal. */
  montoNoFacturable: number;
}

export interface TotalesComerciales {
  subtotal: number;
  itbisTotal: number;
  total: number;
}

export type MotivoDescuentoInvalido = 'sin-base' | 'excede';

export interface OpcionesTotales {
  /**
   * Called when the global discount cannot be applied. Callers filing an e-CF
   * throw from here — DGII rejects negative or zero amounts. Omitted, the
   * discount is capped at the available base instead, because the commercial
   * path runs on every list and detail read and one bad row must not break the
   * endpoint.
   */
  onDescuentoInvalido?: (
    motivo: MotivoDescuentoInvalido,
    basis: number,
    descuentoGlobal: number,
  ) => never;
}

/** Regla de Redondeo: 2 decimals, half-up (Informe Tecnico e-CF v1.0, seccion 13, pg. 22). */
export function redondear(monto: number): number {
  return Math.round(monto * 100) / 100;
}

/** DGII amounts are always 2-decimal fixed strings. */
export function formatMonto(monto: number): string {
  return monto.toFixed(2);
}

export function parseMonto(monto: string | number | null | undefined): number {
  if (monto === null || monto === undefined) return 0;
  const valor = typeof monto === 'string' ? parseFloat(monto) : monto;
  return Number.isFinite(valor) ? valor : 0;
}

/** MontoItem per DGII: (cantidad x precio unitario) - descuento de linea. */
export function computeMontoItem(linea: LineaCalculable): number {
  return (
    parseMonto(linea.cantidad) * parseMonto(linea.precioUnitario) -
    parseMonto(linea.descuento)
  );
}

/**
 * The DGII category a line falls in. Lines that carry an explicit
 * IndicadorFacturacion use it; the rest — Cotizacion lines, which have no such
 * column — are placed by whether any ITBIS was charged, which is safe because
 * the app only ever applies the standard 18% rate (Servicio.llevaItbis and the
 * frontend's computeItbis).
 */
export function resolveIndicador(linea: LineaCalculable): number {
  const indicador = linea.indicadorFacturacion;
  if (indicador !== null && indicador !== undefined) return indicador;
  return parseMonto(linea.itbis) > 0 ? INDICADOR_ITBIS_18 : INDICADOR_ITBIS_0;
}

/**
 * The ITBIS rate a line is taxed at.
 *
 * Deliberately not derived as `itbis / monto`: rows written before per-line
 * discounts were factored into `itbis` stored a gross-based amount, which would
 * yield an inflated rate. Going through the category instead lets those rows
 * recompute correctly with no data migration.
 */
export function resolveTasaItbis(linea: LineaCalculable): number {
  return TASA_POR_INDICADOR[resolveIndicador(linea)] ?? 0;
}

/**
 * Every amount an e-CF's <Totales> carries, bucketed per tax category.
 *
 * The discount is spread across categories in proportion to each one's share of
 * the pre-discount base, per DGII's worked example (Informe Tecnico e-CF v1.0,
 * pg. 28); the last category present absorbs the rounding remainder so the parts
 * sum to the discount exactly. Amounts are rounded per category — the same
 * boundaries DGII validates on — so `montoTotal` here is the figure the XML
 * reports, to the cent.
 */
export function computeTotalesCategorizados(
  lineas: LineaCalculable[],
  descuentoGlobalRaw: string | number | null | undefined,
  opciones: OpcionesTotales = {},
): TotalesCategorizados {
  const brutoPorIndicador = new Map<number, number>();
  for (const linea of lineas) {
    const indicador = resolveIndicador(linea);
    brutoPorIndicador.set(
      indicador,
      (brutoPorIndicador.get(indicador) ?? 0) + computeMontoItem(linea),
    );
  }

  const presentes = INDICADORES_DESCONTABLES.filter(
    (indicador) => (brutoPorIndicador.get(indicador) ?? 0) > 0,
  );
  const basis = presentes.reduce(
    (suma, indicador) => suma + (brutoPorIndicador.get(indicador) ?? 0),
    0,
  );

  let descuentoGlobal = parseMonto(descuentoGlobalRaw);
  if (descuentoGlobal > 0) {
    if (basis <= 0) {
      opciones.onDescuentoInvalido?.('sin-base', basis, descuentoGlobal);
      descuentoGlobal = 0;
    } else if (descuentoGlobal >= basis) {
      opciones.onDescuentoInvalido?.('excede', basis, descuentoGlobal);
      descuentoGlobal = basis;
    }
  } else {
    descuentoGlobal = 0;
  }

  const porIndicador = new Map<number, CategoriaTotales>();
  let asignadoAcumulado = 0;

  presentes.forEach((indicador, index) => {
    const montoGravadoBruto = brutoPorIndicador.get(indicador)!;
    const esUltima = index === presentes.length - 1;
    const descuentoAsignado =
      descuentoGlobal <= 0
        ? 0
        : esUltima
          ? redondear(descuentoGlobal - asignadoAcumulado)
          : redondear((montoGravadoBruto / basis) * descuentoGlobal);
    asignadoAcumulado += descuentoAsignado;

    const montoGravado = redondear(montoGravadoBruto - descuentoAsignado);
    const tasa = TASA_POR_INDICADOR[indicador] ?? 0;
    porIndicador.set(indicador, {
      indicador,
      tasa,
      montoGravadoBruto: redondear(montoGravadoBruto),
      descuentoAsignado,
      montoGravado,
      totalItbis: redondear(montoGravado * tasa),
    });
  });

  const categorias = presentes.map((indicador) => porIndicador.get(indicador)!);
  const gravadas = categorias.filter(
    (categoria) => categoria.indicador !== INDICADOR_EXENTO,
  );

  const montoGravadoTotal = redondear(
    gravadas.reduce((suma, categoria) => suma + categoria.montoGravado, 0),
  );
  const montoExento = porIndicador.get(INDICADOR_EXENTO)?.montoGravado ?? 0;
  const totalItbis = redondear(
    gravadas.reduce((suma, categoria) => suma + categoria.totalItbis, 0),
  );

  return {
    categorias,
    porIndicador,
    descuentoGlobal,
    montoGravadoTotal,
    montoExento,
    totalItbis,
    montoTotal: redondear(montoGravadoTotal + montoExento + totalItbis),
    montoNoFacturable: redondear(
      brutoPorIndicador.get(INDICADOR_NO_FACTURABLE) ?? 0,
    ),
  };
}

/**
 * The commercial view of the same calculation, for the totals a Factura or
 * Cotizacion reports. `total` is taken straight from the categorized result so
 * a fiscal invoice's billed total equals its e-CF MontoTotal exactly, with no
 * reliance on two roundings happening to land on the same cent.
 *
 * `subtotal` still covers every line, including any No Facturable ones, so
 * nothing silently vanishes from the UI; those lines are outside MontoTotal in
 * the XML, which is why they are added back here.
 */
export function calcularTotales(
  lineas: LineaCalculable[],
  descuentoGlobal: string | number | null | undefined,
): TotalesComerciales {
  const totales = computeTotalesCategorizados(lineas, descuentoGlobal);
  return {
    subtotal: redondear(
      lineas.reduce((suma, linea) => suma + computeMontoItem(linea), 0),
    ),
    itbisTotal: totales.totalItbis,
    total: redondear(totales.montoTotal + totales.montoNoFacturable),
  };
}
