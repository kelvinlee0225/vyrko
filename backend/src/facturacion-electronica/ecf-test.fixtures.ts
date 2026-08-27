import { Factura } from '../factura/entities/factura.entity';
import { FacturaLinea } from '../factura/entities/factura-linea.entity';
import { Empresa } from '../empresa/entities/empresa.entity';
import { Cliente } from '../cliente/entities/cliente.entity';
import { IndicadorFacturacion } from '../factura/enums/indicador-facturacion.enum';
import { TipoECF } from '../factura/enums/tipo-ecf.enum';
import { TipoIdentificacion } from '../cliente/enums/tipo-identificacion.enum';

/**
 * Fixtures shared by the facturacion-electronica specs. Not a *.spec.ts file so
 * Jest's testRegex leaves it alone.
 */

const TASAS: Record<IndicadorFacturacion, number> = {
  [IndicadorFacturacion.NO_FACTURABLE]: 0,
  [IndicadorFacturacion.ITBIS_18]: 0.18,
  [IndicadorFacturacion.ITBIS_16]: 0.16,
  [IndicadorFacturacion.ITBIS_0]: 0,
  [IndicadorFacturacion.EXENTO]: 0,
};

export function makeLinea(
  monto: number,
  indicador: IndicadorFacturacion = IndicadorFacturacion.ITBIS_18,
  descuentoLinea = 0,
): FacturaLinea {
  const base = monto - descuentoLinea;
  return {
    descripcion: `Linea ${indicador}`,
    cantidad: '1',
    precioUnitario: monto.toFixed(2),
    itbis: (Math.round(base * TASAS[indicador] * 100) / 100).toFixed(2),
    descuento: descuentoLinea ? descuentoLinea.toFixed(2) : null,
    indicadorFacturacion: indicador,
    pieza: null,
  } as FacturaLinea;
}

export function makeCliente(numeroIdentificacion: string | null): Cliente {
  return {
    nombreRazonSocial: 'Cliente de Prueba SRL',
    numeroIdentificacion,
    tipoIdentificacion: numeroIdentificacion
      ? TipoIdentificacion.RNC
      : TipoIdentificacion.NINGUNA,
  } as Cliente;
}

export function makeFactura(
  lineas: FacturaLinea[],
  overrides: Partial<Factura> = {},
): Factura {
  return {
    id: 'fac-test',
    tipoECF: TipoECF.CREDITO_FISCAL,
    fechaEmision: '2026-08-27',
    fechaVencimiento: null,
    descuentoGlobal: null,
    cliente: makeCliente('130862346'),
    lineas,
    ...overrides,
  } as Factura;
}

export function makeEmpresa(): Empresa {
  return {
    rnc: '131880738',
    nombre: 'Vyrko SRL',
    nombreComercial: 'Vyrko',
    direccion: 'Av. Principal 1',
    telefono: '809-555-0100',
    correo: 'facturacion@vyrko.do',
    municipio: '320200',
    provincia: '320000',
    actividadEconomica: 'Reparacion de vehiculos',
  } as Empresa;
}

/** Text of the first occurrence of an element, or null when absent. */
export function elementText(xml: string, tag: string): string | null {
  const match = new RegExp(`<${tag}>([^<]*)</${tag}>`).exec(xml);
  return match ? match[1] : null;
}

/** Names of the direct children of the first matching container, in document order. */
export function childOrder(xml: string, container: string): string[] {
  const match = new RegExp(`<${container}>(.*?)</${container}>`, 's').exec(xml);
  if (!match) return [];
  return [...match[1].matchAll(/<([A-Za-z0-9]+)>/g)].map((m) => m[1]);
}
