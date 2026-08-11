import { BadRequestException, Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { Factura } from '../factura/entities/factura.entity';
import { Empresa } from '../empresa/entities/empresa.entity';
import { TipoECF } from '../factura/enums/tipo-ecf.enum';
import { TipoIdentificacion } from '../cliente/enums/tipo-identificacion.enum';
import { IndicadorFacturacion } from '../factura/enums/indicador-facturacion.enum';
import {
  agruparLineasPorIndicador,
  assertMaxLength,
  formatFechaIso,
  formatMonto,
} from './ecf-xml.util';

/**
 * Builds the lightweight <RFCE> summary sent instead of the full e-CF for
 * tipo-32 invoices under RD$250,000, per e-cf/xsd/RFCE 32 v.1.0.xsd. Pure
 * function — takes the already-assigned eNCF and the already-computed
 * CodigoSeguridadeCF as inputs (see EcfSignerService.computeCodigoSeguridad,
 * which must run against the full e-CF's signature before this is called —
 * the full e-CF is still generated and signed for every RFCE invoice, DGII
 * requires it retained locally even though only this summary is submitted).
 *
 * Structurally much lighter than the full e-CF: no DetallesItems (line items
 * stay only in the locally-retained full e-CF), Emisor only carries
 * RNC/RazonSocial/FechaEmision (no address/phone/etc.), and there's no
 * FechaHoraFirma at the root — the signature block follows Encabezado
 * directly.
 */
@Injectable()
export class RfceXmlBuilderService {
  build(
    factura: Factura,
    empresa: Empresa,
    eNCF: string,
    codigoSeguridad: string,
  ): string {
    if (factura.tipoECF !== TipoECF.CONSUMO) {
      throw new BadRequestException(
        `La factura ${factura.id} no es tipo 32 (Factura de Consumo); RFCE solo aplica a ese tipo`,
      );
    }
    for (const linea of factura.lineas) {
      if (linea.indicadorFacturacion === null) {
        throw new BadRequestException(
          `La linea "${linea.descripcion}" de la factura ${factura.id} no tiene un indicador de facturacion (ITBIS/Exento/0%/No Facturable) asignado`,
        );
      }
    }

    const doc = create({ version: '1.0', encoding: 'UTF-8' }).ele('RFCE');
    const encabezado = doc.ele('Encabezado');
    encabezado.ele('Version').txt('1.0');

    const idDoc = encabezado.ele('IdDoc');
    idDoc.ele('TipoeCF').txt(String(TipoECF.CONSUMO));
    idDoc.ele('eNCF').txt(eNCF);
    idDoc.ele('TipoIngresos').txt('01'); // Ingresos por operaciones (No financieros) — matches EcfXmlBuilderService
    idDoc.ele('TipoPago').txt(factura.fechaVencimiento ? '2' : '1');

    const emisor = encabezado.ele('Emisor');
    emisor
      .ele('RNCEmisor')
      .txt(assertMaxLength(empresa.rnc, 11, 'Empresa.rnc'));
    emisor
      .ele('RazonSocialEmisor')
      .txt(assertMaxLength(empresa.nombre, 150, 'Empresa.nombre'));
    emisor.ele('FechaEmision').txt(formatFechaIso(factura.fechaEmision));

    // Comprador is required (minOccurs=1) even when fully anonymous — its
    // children are all optional, so an empty <Comprador/> is valid for a
    // walk-in consumer with no RNC/cedula on file.
    const comprador = encabezado.ele('Comprador');
    const rncOCedulaComprador = this.resolveRncCedulaComprador(factura);
    if (rncOCedulaComprador)
      comprador.ele('RNCComprador').txt(rncOCedulaComprador);
    if (factura.cliente.nombreRazonSocial) {
      comprador
        .ele('RazonSocialComprador')
        .txt(
          assertMaxLength(
            factura.cliente.nombreRazonSocial,
            150,
            'Cliente.nombreRazonSocial',
          ),
        );
    }

    this.buildTotales(encabezado.ele('Totales'), factura);

    encabezado.ele('CodigoSeguridadeCF').txt(codigoSeguridad);

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

  private buildTotales(totalesEl: ReturnType<typeof create>, factura: Factura) {
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

    // RFCE's Totales has no ITBIS1/2/3 rate-percentage fields (unlike the full
    // e-CF) — order matches e-cf/xsd/RFCE 32 v.1.0.xsd's xs:sequence exactly.
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
    totalesEl.ele('TotalITBIS').txt(formatMonto(totalItbis));
    if (tasa18.montoGravado > 0)
      totalesEl.ele('TotalITBIS1').txt(formatMonto(tasa18.totalItbis));
    if (tasa16.montoGravado > 0)
      totalesEl.ele('TotalITBIS2').txt(formatMonto(tasa16.totalItbis));
    if (tasa0.montoGravado > 0)
      totalesEl.ele('TotalITBIS3').txt(formatMonto(tasa0.totalItbis));
    totalesEl.ele('MontoTotal').txt(formatMonto(montoTotal));
  }
}
