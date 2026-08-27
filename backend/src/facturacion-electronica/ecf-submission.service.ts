import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Factura } from '../factura/entities/factura.entity';
import { Empresa } from '../empresa/entities/empresa.entity';
import { TipoECF } from '../factura/enums/tipo-ecf.enum';
import { EstadoDgii } from '../factura/enums/estado-dgii.enum';
import { SecuenciaNcfService } from '../secuencia-ncf/secuencia-ncf.service';
import { EmpresaService } from '../empresa/empresa.service';
import { EcfXmlBuilderService } from './ecf-xml-builder.service';
import { RfceXmlBuilderService } from './rfce-xml-builder.service';
import { EcfSignerService } from './ecf-signer.service';
import { DgiiAuthService } from './dgii-auth.service';
import { computeTotalesEcf, UMBRAL_RFCE } from './ecf-xml.util';
import {
  DGII_ECF_HOST,
  DGII_FC_HOST,
  getAmbienteDgii,
  postXmlMultipart,
  resolveAmbienteSegmento,
} from './dgii-http.util';

const FACTURA_RELATIONS = {
  cliente: true,
  lineas: { servicio: true, pieza: true },
} as const;

interface RespuestaRecepcion {
  trackId: string | null;
  error: string | null;
  mensaje: string | null;
}

interface RespuestaRecepcionFc {
  codigo: number;
  estado: string;
  mensajes: { codigo: string; valor: string }[];
  encf: string;
  secuenciaUtilizada: boolean;
}

interface RespuestaConsultaResultado {
  trackId: string;
  codigo: number;
  estado: string;
  mensajes: { codigo: number; valor: string }[];
}

/** Estados that still expect a later consultaresultado check. */
const ESTADOS_PENDIENTES = [EstadoDgii.ENVIADO, EstadoDgii.EN_PROCESO];

/**
 * Orchestrates sending a fiscal Factura to DGII: assigns a real e-NCF,
 * builds+signs the XML, routes to the correct submission endpoint by
 * tipo+monto, and persists the result. A deliberate one-way action (like
 * e-NCF assignment itself) — triggered explicitly via
 * POST /facturas/:id/enviar-dgii, never as a side effect of invoice
 * creation/edits.
 * Source: e-cf/Descripcion_20Tecnica_20Servicios_20DGII.pdf.
 */
@Injectable()
export class EcfSubmissionService {
  constructor(
    private readonly config: ConfigService,
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    private readonly empresaService: EmpresaService,
    private readonly secuenciaNcfService: SecuenciaNcfService,
    private readonly ecfXmlBuilder: EcfXmlBuilderService,
    private readonly rfceXmlBuilder: RfceXmlBuilderService,
    private readonly signer: EcfSignerService,
    private readonly dgiiAuth: DgiiAuthService,
  ) {}

  async submit(facturaId: string): Promise<Factura> {
    const factura = await this.facturaRepository.findOne({
      where: { id: facturaId },
      relations: FACTURA_RELATIONS,
    });
    if (!factura) {
      throw new NotFoundException(`Factura ${facturaId} no encontrada`);
    }
    if (factura.tipoECF === null) {
      throw new BadRequestException(
        `La factura ${facturaId} no esta clasificada como fiscal (tipoECF); no se puede enviar a la DGII`,
      );
    }
    if (factura.eNCF || factura.estadoDgii) {
      throw new BadRequestException(
        `La factura ${facturaId} ya fue enviada a la DGII (eNCF ${factura.eNCF}); no se puede reenviar`,
      );
    }

    const empresa = await this.empresaService.find();

    const { eNCF, fechaVencimientoSecuencia } =
      await this.secuenciaNcfService.getNextENCF(factura.tipoECF);

    const xmlFirmado = this.signer.sign(
      this.ecfXmlBuilder.build(
        factura,
        empresa,
        eNCF,
        fechaVencimientoSecuencia,
      ),
    );
    const codigoSeguridad = this.signer.computeCodigoSeguridad(xmlFirmado);

    factura.eNCF = eNCF;
    factura.codigoSeguridad = codigoSeguridad;
    factura.fechaFirma = new Date();
    // DGII requires the full e-CF retained locally even when only the RFCE
    // summary is what's actually transmitted below.
    factura.xmlGenerado = xmlFirmado;

    const token = await this.dgiiAuth.getToken(empresa);
    const ambiente = getAmbienteDgii(this.config);
    const segmento = resolveAmbienteSegmento(ambiente);
    const nombreArchivo = `${empresa.rnc}${eNCF}.xml`;

    if (this.esViaRfce(factura)) {
      await this.enviarPorRfce(
        factura,
        empresa,
        eNCF,
        codigoSeguridad,
        segmento,
        nombreArchivo,
        token,
      );
    } else {
      await this.enviarPorRecepcion(
        factura,
        xmlFirmado,
        segmento,
        nombreArchivo,
        token,
      );
    }

    return this.facturaRepository.save(factura);
  }

  /**
   * Checks DGII's async validation result for a full e-CF sent via
   * Recepcion (RFCE resolves synchronously in `submit`, so this is a no-op
   * for it). Called on-demand (invoice detail view) and by the periodic
   * safety-net sweep — both share this so the mapping only lives once.
   * Source: e-cf/Descripcion_20Tecnica_20Servicios_20DGII.pdf, "Consulta de
   * resultado e-CF".
   */
  async consultarResultado(factura: Factura): Promise<Factura> {
    if (
      !factura.trackId ||
      !factura.estadoDgii ||
      !ESTADOS_PENDIENTES.includes(factura.estadoDgii)
    ) {
      return factura;
    }

    const empresa = await this.empresaService.find();
    const token = await this.dgiiAuth.getToken(empresa);
    const ambiente = getAmbienteDgii(this.config);
    const segmento = resolveAmbienteSegmento(ambiente);
    const url = `${DGII_ECF_HOST}/${segmento}/consultaresultado/api/consultas/estado?trackid=${factura.trackId}`;

    const response = await fetch(url, {
      headers: { accept: 'application/json', Authorization: `bearer ${token}` },
    });
    if (!response.ok) {
      throw new BadRequestException(
        `DGII rechazo la consulta de resultado (HTTP ${response.status}): ${await response.text()}`,
      );
    }
    const body = (await response.json()) as RespuestaConsultaResultado;

    const nuevoEstado = this.mapCodigoConsultaResultado(body.codigo);
    if (nuevoEstado) {
      factura.estadoDgii = nuevoEstado;
    }
    factura.mensajesDgii = JSON.stringify(body.mensajes ?? []);
    return this.facturaRepository.save(factura);
  }

  /**
   * codigo 0 ("No encontrado") means DGII hasn't registered the trackId's
   * result yet — not an error, just still pending, so the caller's current
   * estado is left untouched.
   */
  private mapCodigoConsultaResultado(codigo: number): EstadoDgii | null {
    switch (codigo) {
      case 1:
        return EstadoDgii.ACEPTADO;
      case 2:
        return EstadoDgii.RECHAZADO;
      case 3:
        return EstadoDgii.EN_PROCESO;
      case 4:
        return EstadoDgii.ACEPTADO_CONDICIONAL;
      default:
        return null;
    }
  }

  /**
   * Routes on the same MontoTotal the XML itself carries (computeTotalesEcf),
   * so an invoice can never be sent down the RFCE path while its e-CF reports
   * a total at or above the threshold.
   */
  private esViaRfce(factura: Factura): boolean {
    return (
      factura.tipoECF === TipoECF.CONSUMO &&
      computeTotalesEcf(factura).montoTotal < UMBRAL_RFCE
    );
  }

  private async enviarPorRecepcion(
    factura: Factura,
    xmlFirmado: string,
    segmento: string,
    nombreArchivo: string,
    token: string,
  ): Promise<void> {
    const url = `${DGII_ECF_HOST}/${segmento}/recepcion/api/facturaselectronicas`;
    const response = await postXmlMultipart(
      url,
      xmlFirmado,
      nombreArchivo,
      token,
    );
    if (!response.ok) {
      throw new BadRequestException(
        `DGII rechazo la recepcion del e-CF (HTTP ${response.status}): ${await response.text()}`,
      );
    }
    const body = (await response.json()) as RespuestaRecepcion;

    if (body.error) {
      factura.estadoDgii = EstadoDgii.RECHAZADO;
      factura.mensajesDgii = JSON.stringify([
        { codigo: body.error, valor: body.mensaje },
      ]);
      return;
    }
    if (!body.trackId) {
      throw new BadRequestException(
        `DGII acepto la recepcion del e-CF pero no devolvio un trackId; respuesta: ${JSON.stringify(body)}`,
      );
    }
    factura.trackId = body.trackId;
    factura.estadoDgii = EstadoDgii.ENVIADO;
  }

  private async enviarPorRfce(
    factura: Factura,
    empresa: Empresa,
    eNCF: string,
    codigoSeguridad: string,
    segmento: string,
    nombreArchivo: string,
    token: string,
  ): Promise<void> {
    const rfceFirmado = this.signer.sign(
      this.rfceXmlBuilder.build(factura, empresa, eNCF, codigoSeguridad),
    );
    const url = `${DGII_FC_HOST}/${segmento}/recepcionfc/api/recepcion/ecf`;
    const response = await postXmlMultipart(
      url,
      rfceFirmado,
      nombreArchivo,
      token,
    );
    if (!response.ok) {
      throw new BadRequestException(
        `DGII rechazo la recepcion del RFCE (HTTP ${response.status}): ${await response.text()}`,
      );
    }
    const body = (await response.json()) as RespuestaRecepcionFc;

    factura.estadoDgii = this.normalizeEstadoRfce(body.estado);
    factura.mensajesDgii = JSON.stringify(body.mensajes ?? []);
  }

  /**
   * Unlike full-eCF recepcion (async, resolved later via consultaresultado),
   * DGII's RFCE recepcion resolves synchronously to Aceptado/Aceptado
   * condicional/Rechazado in the response itself.
   */
  private normalizeEstadoRfce(estado: string): EstadoDgii {
    const DIACRITICS = new RegExp('[\\u0300-\\u036f]', 'g');
    const normalizado = estado
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(DIACRITICS, '')
      .replace(/\s+/g, '_');
    const mapa: Record<string, EstadoDgii> = {
      aceptado: EstadoDgii.ACEPTADO,
      aceptado_condicional: EstadoDgii.ACEPTADO_CONDICIONAL,
      rechazado: EstadoDgii.RECHAZADO,
    };
    const resuelto = mapa[normalizado];
    if (!resuelto) {
      throw new BadRequestException(
        `DGII devolvio un estado de RFCE no reconocido: "${estado}"`,
      );
    }
    return resuelto;
  }
}
