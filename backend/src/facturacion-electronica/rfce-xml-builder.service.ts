import { BadRequestException, Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { Factura } from '../factura/entities/factura.entity';
import { Empresa } from '../empresa/entities/empresa.entity';
import { TipoECF } from '../factura/enums/tipo-ecf.enum';
import { TipoIdentificacion } from '../cliente/enums/tipo-identificacion.enum';
import { IndicadorFacturacion } from '../factura/enums/indicador-facturacion.enum';
import {
  assertMaxLength,
  computeTotalesEcf,
  esPagoCredito,
  formatFechaIso,
  formatMonto,
  TotalesEcf,
} from './ecf-xml.util';

type XmlNode = ReturnType<typeof create>;

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
 * directly. Its IdDoc also has no FechaLimitePago element at all, unlike the
 * full e-CF, so TipoPago is emitted alone here.
 *
 * Shares computeTotalesEcf with EcfXmlBuilderService so the summary and the
 * retained full e-CF report identical amounts.
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

    const totales = computeTotalesEcf(factura);

    const doc = create({ version: '1.0', encoding: 'UTF-8' }).ele('RFCE');
    const encabezado = doc.ele('Encabezado');
    encabezado.ele('Version').txt('1.0');

    const idDoc = encabezado.ele('IdDoc');
    idDoc.ele('TipoeCF').txt(String(TipoECF.CONSUMO));
    idDoc.ele('eNCF').txt(eNCF);
    idDoc.ele('TipoIngresos').txt('01'); // Ingresos por operaciones (No financieros) — matches EcfXmlBuilderService
    idDoc.ele('TipoPago').txt(esPagoCredito(factura) ? '2' : '1');

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
    // walk-in consumer with no RNC/cedula on file. An RFCE is by definition
    // below RD$250,000, so DGII's buyer-identification threshold (Formato
    // field 38 validacion b) never applies on this path.
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

    this.buildTotales(encabezado.ele('Totales'), totales);

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

  private buildTotales(totalesEl: XmlNode, totales: TotalesEcf) {
    const tasa18 = totales.porIndicador.get(IndicadorFacturacion.ITBIS_18);
    const tasa16 = totales.porIndicador.get(IndicadorFacturacion.ITBIS_16);
    const tasa0 = totales.porIndicador.get(IndicadorFacturacion.ITBIS_0);
    const exento = totales.porIndicador.get(IndicadorFacturacion.EXENTO);

    // RFCE's Totales has no ITBIS1/2/3 rate-percentage fields (unlike the full
    // e-CF) — order matches e-cf/xsd/RFCE 32 v.1.0.xsd's xs:sequence exactly.
    totalesEl
      .ele('MontoGravadoTotal')
      .txt(formatMonto(totales.montoGravadoTotal));
    if (tasa18) {
      totalesEl.ele('MontoGravadoI1').txt(formatMonto(tasa18.montoGravado));
    }
    if (tasa16) {
      totalesEl.ele('MontoGravadoI2').txt(formatMonto(tasa16.montoGravado));
    }
    if (tasa0) {
      totalesEl.ele('MontoGravadoI3').txt(formatMonto(tasa0.montoGravado));
    }
    if (exento) {
      totalesEl.ele('MontoExento').txt(formatMonto(exento.montoGravado));
    }
    totalesEl.ele('TotalITBIS').txt(formatMonto(totales.totalItbis));
    if (tasa18)
      totalesEl.ele('TotalITBIS1').txt(formatMonto(tasa18.totalItbis));
    if (tasa16)
      totalesEl.ele('TotalITBIS2').txt(formatMonto(tasa16.totalItbis));
    if (tasa0) totalesEl.ele('TotalITBIS3').txt(formatMonto(tasa0.totalItbis));
    totalesEl.ele('MontoTotal').txt(formatMonto(totales.montoTotal));
    if (totales.montoNoFacturable > 0) {
      totalesEl
        .ele('MontoNoFacturable')
        .txt(formatMonto(totales.montoNoFacturable));
    }
  }
}
