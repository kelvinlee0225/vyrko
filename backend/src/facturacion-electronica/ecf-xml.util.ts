import { BadRequestException } from '@nestjs/common';
import { Factura } from '../factura/entities/factura.entity';
import {
  computeMontoItem,
  computeTotalesCategorizados,
  formatMonto,
  INDICADORES_DESCONTABLES,
  TotalesCategorizados,
} from '../common/totales/totales.util';

/** Shared helpers between EcfXmlBuilderService and RfceXmlBuilderService. */

export { computeMontoItem, formatMonto, INDICADORES_DESCONTABLES };
export type TotalesEcf = TotalesCategorizados;

/** e-CF 32 (Factura de Consumo) below this amount goes through RFCE instead of full Recepcion. */
export const UMBRAL_RFCE = 250000;

/**
 * Every number an e-CF's <Totales> carries, computed once so the full e-CF, the
 * RFCE summary, the <DescuentosORecargos> lines, the RFCE routing threshold and
 * the invoice total the app bills can never disagree with one another. The
 * arithmetic itself lives in common/totales/totales.util.ts — this adds the
 * Factura-shaped validation and DGII's error messages.
 *
 * DGII's model differs from taking the discount off the bottom line:
 * - MontoGravadoI{1,2,3} and MontoExento are "menos descuentos mas recargos",
 *   scoped by footnote 12 to the global Descuentos o Recargos section
 *   (Formato fields 93-96, pg. 18-19).
 * - TotalITBIS{n} = MontoGravadoI{n} x tasa (Formato field 101, pg. 21), so
 *   ITBIS is derived from the discounted base rather than summed from each
 *   line's stored `itbis`. That also makes per-line `descuento` come out right.
 * - MontoTotal = MontoGravadoTotal + MontoExento + TotalITBIS + Monto del
 *   Impuesto adicional (Formato field 110, pg. 25) — nothing is subtracted.
 */
export function computeTotalesEcf(factura: Factura): TotalesEcf {
  assertIndicadoresAsignados(factura);

  return computeTotalesCategorizados(factura.lineas, factura.descuentoGlobal, {
    onDescuentoInvalido: (motivo, basis, descuentoGlobal) => {
      if (motivo === 'sin-base') {
        throw new BadRequestException(
          `La factura ${factura.id} tiene un descuento global pero ninguna linea facturable sobre la cual aplicarlo`,
        );
      }
      throw new BadRequestException(
        `El descuento global de la factura ${factura.id} (${formatMonto(descuentoGlobal)}) iguala o supera el monto gravado (${formatMonto(basis)}); la DGII no acepta montos negativos ni un e-CF en cero`,
      );
    },
  });
}

/**
 * Lives here rather than in each builder so callers that only need the totals
 * (the RFCE routing decision) are guarded too — an unclassified line would
 * otherwise be silently bucketed by its itbis amount, which is a fine default
 * for a non-fiscal quote but a guess an e-CF must never make.
 */
function assertIndicadoresAsignados(factura: Factura): void {
  for (const linea of factura.lineas) {
    if (
      linea.indicadorFacturacion === null ||
      linea.indicadorFacturacion === undefined
    ) {
      throw new BadRequestException(
        `La linea "${linea.descripcion}" de la factura ${factura.id} no tiene un indicador de facturacion (ITBIS/Exento/0%/No Facturable) asignado`,
      );
    }
  }
}

/**
 * TipoPago 2 (Credito) when the invoice carries a due date, 1 (Contado)
 * otherwise. Shared so the full e-CF, the RFCE and the FechaLimitePago guard
 * all derive it identically.
 */
export function esPagoCredito(factura: Factura): boolean {
  return Boolean(factura.fechaVencimiento);
}

/** Factura/SecuenciaNcf 'date' columns come back as "YYYY-MM-DD"; DGII wants "DD-MM-YYYY". */
export function formatFechaIso(isoDate: string): string {
  const [y, m, d] = isoDate.split('-');
  return `${d}-${m}-${y}`;
}

export function formatFechaHora(date: Date): string {
  const d = String(date.getDate()).padStart(2, '0');
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const y = date.getFullYear();
  const h = String(date.getHours()).padStart(2, '0');
  const min = String(date.getMinutes()).padStart(2, '0');
  const s = String(date.getSeconds()).padStart(2, '0');
  return `${d}-${m}-${y} ${h}:${min}:${s}`;
}

export function assertMaxLength(
  value: string,
  max: number,
  field: string,
): string {
  if (value.length > max) {
    throw new BadRequestException(
      `${field} excede el largo maximo de ${max} caracteres exigido por DGII`,
    );
  }
  return value;
}
