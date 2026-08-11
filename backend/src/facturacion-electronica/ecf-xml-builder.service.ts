import { BadRequestException, Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { Factura } from '../factura/entities/factura.entity';
import { FacturaLinea } from '../factura/entities/factura-linea.entity';
import { Empresa } from '../empresa/entities/empresa.entity';
import { TipoECF } from '../factura/enums/tipo-ecf.enum';
import { TipoIdentificacion } from '../cliente/enums/tipo-identificacion.enum';
import { IndicadorFacturacion } from '../factura/enums/indicador-facturacion.enum';
import {
  agruparLineasPorIndicador,
  assertMaxLength,
  computeMontoItem,
  formatFechaHora,
  formatFechaIso,
  formatMonto,
} from './ecf-xml.util';

/** xmlbuilder2 doesn't re-export its XMLBuilder interface from the package root. */
type XmlNode = ReturnType<typeof create>;

/**
 * Builds the full <ECF> XML for e-CF tipo 31 (Factura de Crédito Fiscal) and
 * tipo 32 (Factura de Consumo), per e-cf/xsd/e-CF 31 v.1.0 (1).xsd and
 * e-cf/xsd/e-CF 32 v.1.0.xsd. Pure function: takes an already-assigned eNCF
 * (and, for tipo 31, the sequence's fechaVencimiento) — does not touch
 * SecuenciaNcf or persist anything, since assigning a real e-NCF is a
 * one-way action that belongs to the submission orchestration, not a
 * builder that could be called more than once.
 *
 * Deliberately out of scope for this pass (all optional per XSD, unused by
 * this app's data model today): Transporte, InformacionesAdicionales,
 * OtraMoneda, Subtotales, Paginacion, InformacionReferencia (33/34 only),
 * TablaFormasPago, retention fields (TotalITBISRetenido etc.).
 */
@Injectable()
export class EcfXmlBuilderService {
  build(
    factura: Factura,
    empresa: Empresa,
    eNCF: string,
    fechaVencimientoSecuencia: string | null,
  ): string {
    if (
      factura.tipoECF !== TipoECF.CREDITO_FISCAL &&
      factura.tipoECF !== TipoECF.CONSUMO
    ) {
      throw new BadRequestException(
        `La factura ${factura.id} no tiene un tipoECF valido (31 o 32) para generar un e-CF`,
      );
    }
    if (
      factura.tipoECF === TipoECF.CREDITO_FISCAL &&
      !fechaVencimientoSecuencia
    ) {
      throw new BadRequestException(
        'La secuencia de e-NCF para tipo 31 no tiene fecha de vencimiento registrada; DGII la exige en el XML',
      );
    }
    const rncOCedulaComprador = this.resolveRncCedulaComprador(factura);
    if (factura.tipoECF === TipoECF.CREDITO_FISCAL && !rncOCedulaComprador) {
      throw new BadRequestException(
        `El cliente de la factura ${factura.id} no tiene RNC/cedula registrado; requerido para e-CF tipo 31 (Factura de Credito Fiscal)`,
      );
    }
    for (const linea of factura.lineas) {
      if (linea.indicadorFacturacion === null) {
        throw new BadRequestException(
          `La linea "${linea.descripcion}" de la factura ${factura.id} no tiene un indicador de facturacion (ITBIS/Exento/0%/No Facturable) asignado`,
        );
      }
    }

    const doc = create({ version: '1.0', encoding: 'UTF-8' }).ele('ECF');
    const encabezado = doc.ele('Encabezado');
    encabezado.ele('Version').txt('1.0');

    const idDoc = encabezado.ele('IdDoc');
    idDoc.ele('TipoeCF').txt(String(factura.tipoECF));
    idDoc.ele('eNCF').txt(eNCF);
    if (factura.tipoECF === TipoECF.CREDITO_FISCAL) {
      idDoc
        .ele('FechaVencimientoSecuencia')
        .txt(formatFechaIso(fechaVencimientoSecuencia!));
    }
    idDoc.ele('TipoIngresos').txt('01'); // Ingresos por operaciones (No financieros) — the only category this app's ordinary sales fall under
    idDoc.ele('TipoPago').txt(factura.fechaVencimiento ? '2' : '1'); // 2=Credito if a due date was set, 1=Contado otherwise

    const emisor = encabezado.ele('Emisor');
    emisor
      .ele('RNCEmisor')
      .txt(assertMaxLength(empresa.rnc, 11, 'Empresa.rnc'));
    emisor
      .ele('RazonSocialEmisor')
      .txt(assertMaxLength(empresa.nombre, 150, 'Empresa.nombre'));
    if (empresa.nombreComercial) {
      emisor
        .ele('NombreComercial')
        .txt(
          assertMaxLength(
            empresa.nombreComercial,
            150,
            'Empresa.nombreComercial',
          ),
        );
    }
    emisor
      .ele('DireccionEmisor')
      .txt(assertMaxLength(empresa.direccion, 100, 'Empresa.direccion'));
    // Municipio/Provincia store DGII numeric codes (ProvinciaMunicipioType), validated
    // against the official catalog at write time (UpsertEmpresaDto) — see
    // common/catalogos/provincia-municipio.catalogo.ts.
    if (empresa.municipio) emisor.ele('Municipio').txt(empresa.municipio);
    if (empresa.provincia) emisor.ele('Provincia').txt(empresa.provincia);
    if (empresa.telefono) {
      emisor
        .ele('TablaTelefonoEmisor')
        .ele('TelefonoEmisor')
        .txt(empresa.telefono);
    }
    if (empresa.correo) emisor.ele('CorreoEmisor').txt(empresa.correo);
    if (empresa.actividadEconomica) {
      emisor
        .ele('ActividadEconomica')
        .txt(
          assertMaxLength(
            empresa.actividadEconomica,
            100,
            'Empresa.actividadEconomica',
          ),
        );
    }
    emisor.ele('FechaEmision').txt(formatFechaIso(factura.fechaEmision));

    const comprador = encabezado.ele('Comprador');
    if (rncOCedulaComprador)
      comprador.ele('RNCComprador').txt(rncOCedulaComprador);
    comprador
      .ele('RazonSocialComprador')
      .txt(
        assertMaxLength(
          factura.cliente.nombreRazonSocial,
          150,
          'Cliente.nombreRazonSocial',
        ),
      );

    this.buildTotales(encabezado.ele('Totales'), factura);

    const detallesItems = doc.ele('DetallesItems');
    factura.lineas.forEach((linea, index) => {
      this.buildItem(detallesItems, linea, index + 1);
    });

    this.buildDescuentosORecargos(doc, factura);

    doc.ele('FechaHoraFirma').txt(formatFechaHora(new Date()));

    return doc.end({ prettyPrint: false, headless: false });
  }

  private resolveRncCedulaComprador(factura: Factura): string | null {
    const { tipoIdentificacion, numeroIdentificacion } = factura.cliente;
    if (
      tipoIdentificacion === TipoIdentificacion.NINGUNA ||
      !numeroIdentificacion
    ) {
      return null;
    }
    return numeroIdentificacion;
  }

  private buildTotales(totalesEl: XmlNode, factura: Factura) {
    const porTasa = agruparLineasPorIndicador(factura.lineas);
    const tasa18 = porTasa.get(IndicadorFacturacion.ITBIS_18) ?? {
      montoGravado: 0,
      totalItbis: 0,
    };
    const tasa16 = porTasa.get(IndicadorFacturacion.ITBIS_16) ?? {
      montoGravado: 0,
      totalItbis: 0,
    };
    const tasa0 = porTasa.get(IndicadorFacturacion.ITBIS_0) ?? {
      montoGravado: 0,
      totalItbis: 0,
    };
    const exento = porTasa.get(IndicadorFacturacion.EXENTO) ?? {
      montoGravado: 0,
      totalItbis: 0,
    };

    const montoGravadoTotal =
      tasa18.montoGravado + tasa16.montoGravado + tasa0.montoGravado;
    const totalItbis = tasa18.totalItbis + tasa16.totalItbis + tasa0.totalItbis;
    const descuentoGlobal = factura.descuentoGlobal
      ? parseFloat(factura.descuentoGlobal)
      : 0;
    const montoTotal =
      montoGravadoTotal + exento.montoGravado + totalItbis - descuentoGlobal;

    // Order matches the XSD's xs:sequence exactly — DGII validates positionally.
    totalesEl.ele('MontoGravadoTotal').txt(formatMonto(montoGravadoTotal));
    if (tasa18.montoGravado > 0) {
      totalesEl.ele('MontoGravadoI1').txt(formatMonto(tasa18.montoGravado));
    }
    if (tasa16.montoGravado > 0) {
      totalesEl.ele('MontoGravadoI2').txt(formatMonto(tasa16.montoGravado));
    }
    if (tasa0.montoGravado > 0) {
      totalesEl.ele('MontoGravadoI3').txt(formatMonto(tasa0.montoGravado));
    }
    if (exento.montoGravado > 0) {
      totalesEl.ele('MontoExento').txt(formatMonto(exento.montoGravado));
    }
    if (tasa18.montoGravado > 0) totalesEl.ele('ITBIS1').txt('18');
    if (tasa16.montoGravado > 0) totalesEl.ele('ITBIS2').txt('16');
    if (tasa0.montoGravado > 0) totalesEl.ele('ITBIS3').txt('0');
    totalesEl.ele('TotalITBIS').txt(formatMonto(totalItbis));
    if (tasa18.montoGravado > 0)
      totalesEl.ele('TotalITBIS1').txt(formatMonto(tasa18.totalItbis));
    if (tasa16.montoGravado > 0)
      totalesEl.ele('TotalITBIS2').txt(formatMonto(tasa16.totalItbis));
    if (tasa0.montoGravado > 0)
      totalesEl.ele('TotalITBIS3').txt(formatMonto(tasa0.totalItbis));
    totalesEl.ele('MontoTotal').txt(formatMonto(montoTotal));
  }

  /**
   * Maps Factura.descuentoGlobal (a single flat amount, no per-category
   * breakdown in this app's data model) onto DGII's DescuentosORecargos.
   * When the invoice spans more than one tax category, DGII requires
   * TipoValor '%' and one DescuentoORecargo line per category present
   * (Formato Comprobante Fiscal Electronico V1.0, sec. D). Each category's
   * share is allocated proportional to its pre-discount MontoItem total,
   * per DGII's own worked example (Informe Tecnico e-CF v1.0, pg. 27-28);
   * the last category absorbs the rounding remainder so the lines sum
   * exactly to descuentoGlobal.
   */
  private buildDescuentosORecargos(doc: XmlNode, factura: Factura) {
    const descuentoGlobal = factura.descuentoGlobal
      ? parseFloat(factura.descuentoGlobal)
      : 0;
    if (descuentoGlobal <= 0) return;

    const porTasa = agruparLineasPorIndicador(factura.lineas);
    const categorias = [
      IndicadorFacturacion.ITBIS_18,
      IndicadorFacturacion.ITBIS_16,
      IndicadorFacturacion.ITBIS_0,
      IndicadorFacturacion.EXENTO,
    ]
      .map((indicador) => ({
        indicador,
        montoGravado: porTasa.get(indicador)?.montoGravado ?? 0,
      }))
      .filter((c) => c.montoGravado > 0);

    if (categorias.length === 0) return;

    const descuentosORecargos = doc.ele('DescuentosORecargos');

    if (categorias.length === 1) {
      const entry = descuentosORecargos.ele('DescuentoORecargo');
      entry.ele('NumeroLinea').txt('1');
      entry.ele('TipoAjuste').txt('D');
      entry.ele('TipoValor').txt('$');
      entry.ele('MontoDescuentooRecargo').txt(formatMonto(descuentoGlobal));
      entry
        .ele('IndicadorFacturacionDescuentooRecargo')
        .txt(String(categorias[0].indicador));
      return;
    }

    const basisTotal = categorias.reduce((sum, c) => sum + c.montoGravado, 0);
    let montoAsignado = 0;
    categorias.forEach((categoria, index) => {
      const esUltima = index === categorias.length - 1;
      const montoDescuento = esUltima
        ? Math.round((descuentoGlobal - montoAsignado) * 100) / 100
        : Math.round(
            (categoria.montoGravado / basisTotal) * descuentoGlobal * 100,
          ) / 100;
      montoAsignado += montoDescuento;
      const valorPorcentaje =
        Math.round((montoDescuento / categoria.montoGravado) * 100 * 100) / 100;

      if (montoDescuento <= 0 || valorPorcentaje <= 0) {
        throw new BadRequestException(
          `El descuento global de la factura ${factura.id} es demasiado pequeno para prorratear entre las categorias de impuesto presentes sin producir un valor no positivo (DGII exige ValorDescuentooRecargo > 0)`,
        );
      }

      const entry = descuentosORecargos.ele('DescuentoORecargo');
      entry.ele('NumeroLinea').txt(String(index + 1));
      entry.ele('TipoAjuste').txt('D');
      entry.ele('TipoValor').txt('%');
      entry.ele('ValorDescuentooRecargo').txt(formatMonto(valorPorcentaje));
      entry.ele('MontoDescuentooRecargo').txt(formatMonto(montoDescuento));
      entry
        .ele('IndicadorFacturacionDescuentooRecargo')
        .txt(String(categoria.indicador));
    });
  }

  private buildItem(
    detallesItems: XmlNode,
    linea: FacturaLinea,
    numeroLinea: number,
  ) {
    const item = detallesItems.ele('Item');
    item.ele('NumeroLinea').txt(String(numeroLinea));
    item.ele('IndicadorFacturacion').txt(String(linea.indicadorFacturacion));
    item
      .ele('NombreItem')
      .txt(
        assertMaxLength(
          linea.descripcion,
          80,
          `FacturaLinea.descripcion (linea ${numeroLinea})`,
        ),
      );
    // Heuristic: a line with a Pieza attached represents a physical part sold (Bien);
    // a line with only a Servicio represents labor (Servicio). Informational/reporting
    // field, doesn't change tax treatment — flagged in case it needs a real per-line
    // classification later.
    item.ele('IndicadorBienoServicio').txt(linea.pieza ? '1' : '2');
    item.ele('CantidadItem').txt(linea.cantidad);
    item.ele('PrecioUnitarioItem').txt(linea.precioUnitario);
    if (linea.descuento && parseFloat(linea.descuento) > 0) {
      item.ele('DescuentoMonto').txt(linea.descuento);
    }
    item.ele('MontoItem').txt(formatMonto(computeMontoItem(linea)));
  }
}
