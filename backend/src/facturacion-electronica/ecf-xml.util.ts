import { BadRequestException } from '@nestjs/common';
import { FacturaLinea } from '../factura/entities/factura-linea.entity';
import { IndicadorFacturacion } from '../factura/enums/indicador-facturacion.enum';

/** Shared helpers between EcfXmlBuilderService and RfceXmlBuilderService. */

export interface TotalesPorTasa {
  montoGravado: number;
  totalItbis: number;
}

export function computeMontoItem(linea: FacturaLinea): number {
  const cantidad = parseFloat(linea.cantidad);
  const precioUnitario = parseFloat(linea.precioUnitario);
  const descuento = linea.descuento ? parseFloat(linea.descuento) : 0;
  return cantidad * precioUnitario - descuento;
}

export function agruparLineasPorIndicador(
  lineas: FacturaLinea[],
): Map<IndicadorFacturacion, TotalesPorTasa> {
  const grupos = new Map<IndicadorFacturacion, TotalesPorTasa>();
  for (const linea of lineas) {
    const indicador = linea.indicadorFacturacion!;
    const montoLinea = computeMontoItem(linea);
    const itbisLinea = parseFloat(linea.itbis);
    const acumulado = grupos.get(indicador) ?? {
      montoGravado: 0,
      totalItbis: 0,
    };
    acumulado.montoGravado += montoLinea;
    acumulado.totalItbis += itbisLinea;
    grupos.set(indicador, acumulado);
  }
  return grupos;
}

export function formatMonto(monto: number): string {
  return monto.toFixed(2);
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
