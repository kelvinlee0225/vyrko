import { BadRequestException, Injectable } from '@nestjs/common';
import { create } from 'xmlbuilder2';
import { Factura } from '../factura/entities/factura.entity';
import { FacturaLinea } from '../factura/entities/factura-linea.entity';
import { Empresa } from '../empresa/entities/empresa.entity';
import { TipoECF } from '../factura/enums/tipo-ecf.enum';
import { TipoIdentificacion } from '../cliente/enums/tipo-identificacion.enum';
import { IndicadorFacturacion } from '../factura/enums/indicador-facturacion.enum';
import {
  assertMaxLength,
  computeMontoItem,
  computeTotalesEcf,
  esPagoCredito,
  formatFechaHora,
  formatFechaIso,
  formatMonto,
  TotalesEcf,
  UMBRAL_RFCE,
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
 * Every amount comes from computeTotalesEcf so the totals, the
 * DescuentosORecargos lines and the RFCE routing threshold agree by
 * construction — see ecf-xml.util.ts for DGII's discount/ITBIS model.
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

    const totales = computeTotalesEcf(factura);
    const rncOCedulaComprador = this.resolveRncCedulaComprador(factura);
    this.assertCompradorIdentificado(factura, rncOCedulaComprador, totales);

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
    idDoc.ele('TipoPago').txt(esPagoCredito(factura) ? '2' : '1'); // 2=Credito if a due date was set, 1=Contado otherwise
    this.buildFechaLimitePago(idDoc, factura);

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

    this.buildTotales(encabezado.ele('Totales'), totales);

    const detallesItems = doc.ele('DetallesItems');
    factura.lineas.forEach((linea, index) => {
      this.buildItem(detallesItems, linea, index + 1);
    });

    this.buildDescuentosORecargos(doc, totales);

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

  /**
   * Tipo 31 always requires the buyer's RNC (Formato field 38, obligatoriedad 1
   * for Factura de Credito Fiscal). Tipo 32 requires it only once the invoice
   * reaches RD$250,000: "Si el e-CF es tipo 32 y el monto total es >=
   * DOP$250,000.00 se debe identificar RNC Comprador" (Formato field 38
   * validacion b, pg. 12; RazonSocialComprador likewise per field 40, which
   * this builder always emits from Cliente.nombreRazonSocial).
   *
   * DGII's alternative for a foreign buyer at that threshold is
   * IdentificadorExtranjero, which this app has no data model for — so an
   * explicit error is the only honest outcome rather than filing an e-CF DGII
   * will reject.
   */
  private assertCompradorIdentificado(
    factura: Factura,
    rncOCedulaComprador: string | null,
    totales: TotalesEcf,
  ): void {
    if (rncOCedulaComprador) return;

    if (factura.tipoECF === TipoECF.CREDITO_FISCAL) {
      throw new BadRequestException(
        `El cliente de la factura ${factura.id} no tiene RNC/cedula registrado; requerido para e-CF tipo 31 (Factura de Credito Fiscal)`,
      );
    }
    if (totales.montoTotal >= UMBRAL_RFCE) {
      throw new BadRequestException(
        `El cliente de la factura ${factura.id} no tiene RNC/cedula registrado; la DGII lo exige en una factura de consumo (tipo 32) de RD$${formatMonto(totales.montoTotal)}, por alcanzar o superar RD$${formatMonto(UMBRAL_RFCE)}`,
      );
    }
  }

  /**
   * Conditionally required whenever TipoPago is 2 (Credito): "Solo para
   * facturas a credito. Condicional a que el tipo de pago sea a credito", with
   * validacion b) "Fecha limite de pago debe ser >= Fecha de emision"
   * (Formato field 10, pg. 8 — obligatoriedad 2 for both tipo 31 and 32).
   * Sits directly after TipoPago per the XSD's xs:sequence.
   */
  private buildFechaLimitePago(idDoc: XmlNode, factura: Factura): void {
    if (!esPagoCredito(factura)) return;

    const fechaVencimiento = factura.fechaVencimiento!;
    if (fechaVencimiento < factura.fechaEmision) {
      throw new BadRequestException(
        `La fecha de vencimiento de la factura ${factura.id} (${fechaVencimiento}) es anterior a su fecha de emision (${factura.fechaEmision}); la DGII exige que la fecha limite de pago sea igual o posterior a la de emision`,
      );
    }
    idDoc.ele('FechaLimitePago').txt(formatFechaIso(fechaVencimiento));
  }

  private buildTotales(totalesEl: XmlNode, totales: TotalesEcf) {
    const tasa18 = totales.porIndicador.get(IndicadorFacturacion.ITBIS_18);
    const tasa16 = totales.porIndicador.get(IndicadorFacturacion.ITBIS_16);
    const tasa0 = totales.porIndicador.get(IndicadorFacturacion.ITBIS_0);
    const exento = totales.porIndicador.get(IndicadorFacturacion.EXENTO);

    // Order matches the XSD's xs:sequence exactly — DGII validates positionally.
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
    if (tasa18) totalesEl.ele('ITBIS1').txt('18');
    if (tasa16) totalesEl.ele('ITBIS2').txt('16');
    if (tasa0) totalesEl.ele('ITBIS3').txt('0');
    totalesEl.ele('TotalITBIS').txt(formatMonto(totales.totalItbis));
    if (tasa18)
      totalesEl.ele('TotalITBIS1').txt(formatMonto(tasa18.totalItbis));
    if (tasa16)
      totalesEl.ele('TotalITBIS2').txt(formatMonto(tasa16.totalItbis));
    if (tasa0) totalesEl.ele('TotalITBIS3').txt(formatMonto(tasa0.totalItbis));
    totalesEl.ele('MontoTotal').txt(formatMonto(totales.montoTotal));
    // Reported alongside MontoTotal but never part of it: "Total de la suma de
    // montos de bienes o servicios con Indicador de facturacion=0. Condicional
    // a que en la linea de detalle exista algun item con indicador facturacion
    // igual a cero (0)" (Formato field 111, pg. 26).
    if (totales.montoNoFacturable > 0) {
      totalesEl
        .ele('MontoNoFacturable')
        .txt(formatMonto(totales.montoNoFacturable));
    }
  }

  /**
   * Maps Factura.descuentoGlobal (a single flat amount, no per-category
   * breakdown in this app's data model) onto DGII's DescuentosORecargos, using
   * the same per-category allocation computeTotalesEcf already applied to the
   * totals — so the two sections cannot drift apart.
   *
   * When the invoice spans more than one tax category, DGII requires TipoValor
   * '%' and one DescuentoORecargo line per category present (Formato
   * Comprobante Fiscal Electronico V1.0, pg. 48, seccion D a) and b) 3).
   */
  private buildDescuentosORecargos(doc: XmlNode, totales: TotalesEcf) {
    if (totales.descuentoGlobal <= 0 || totales.categorias.length === 0) return;

    const descuentosORecargos = doc.ele('DescuentosORecargos');
    const porPorcentaje = totales.categorias.length > 1;

    totales.categorias.forEach((categoria, index) => {
      const entry = descuentosORecargos.ele('DescuentoORecargo');
      entry.ele('NumeroLinea').txt(String(index + 1));
      entry.ele('TipoAjuste').txt('D');
      entry.ele('TipoValor').txt(porPorcentaje ? '%' : '$');
      if (porPorcentaje) {
        const valorPorcentaje =
          Math.round(
            (categoria.descuentoAsignado / categoria.montoGravadoBruto) *
              100 *
              100,
          ) / 100;
        if (categoria.descuentoAsignado <= 0 || valorPorcentaje <= 0) {
          throw new BadRequestException(
            `El descuento global es demasiado pequeno para prorratear entre las categorias de impuesto presentes sin producir un valor no positivo (DGII exige ValorDescuentooRecargo > 0)`,
          );
        }
        entry.ele('ValorDescuentooRecargo').txt(formatMonto(valorPorcentaje));
      }
      entry
        .ele('MontoDescuentooRecargo')
        .txt(formatMonto(categoria.descuentoAsignado));
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
