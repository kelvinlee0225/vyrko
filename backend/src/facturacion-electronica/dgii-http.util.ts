import { InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AmbienteDgii } from './enums/ambiente-dgii.enum';

/** Recepcion/consulta/anulacion of full e-CF live under this host. */
export const DGII_ECF_HOST = 'https://ecf.dgii.gov.do';
/** RFCE (Factura de Consumo < RD$250,000) reception/consulta lives under this separate host. */
export const DGII_FC_HOST = 'https://fc.dgii.gov.do';

/**
 * DGII_AMBIENTE is a deployment concern (same reasoning as DGII_CERT_PATH),
 * read from the environment rather than a per-row Empresa column — see
 * docs/AWS_DEPLOYMENT.md §3.
 */
export function getAmbienteDgii(config: ConfigService): AmbienteDgii {
  const raw =
    config.get<string>('DGII_AMBIENTE') ?? AmbienteDgii.PRECERTIFICACION;
  if (!Object.values(AmbienteDgii).includes(raw as AmbienteDgii)) {
    throw new InternalServerErrorException(
      `DGII_AMBIENTE="${raw}" no es valido; debe ser uno de: ${Object.values(AmbienteDgii).join(', ')}`,
    );
  }
  return raw as AmbienteDgii;
}

/** Maps the app's semantic ambiente names to DGII's URL path segments. */
export function resolveAmbienteSegmento(ambiente: AmbienteDgii): string {
  switch (ambiente) {
    case AmbienteDgii.PRECERTIFICACION:
      return 'testecf';
    case AmbienteDgii.CERTIFICACION:
      return 'certecf';
    case AmbienteDgii.PRODUCCION:
      return 'ecf';
  }
}

/**
 * Every DGII write endpoint (validarsemilla, recepcion, recepcionfc,
 * anulacionrangos, aprobacioncomercial) takes the same shape: a signed XML
 * document uploaded as multipart/form-data field "xml", optionally under a
 * Bearer token.
 */
export function postXmlMultipart(
  url: string,
  xml: string,
  filename: string,
  token?: string,
): Promise<Response> {
  const form = new FormData();
  form.append('xml', new Blob([xml], { type: 'text/xml' }), filename);
  const headers: Record<string, string> = { accept: 'application/json' };
  if (token) headers['Authorization'] = `bearer ${token}`;
  return fetch(url, { method: 'POST', headers, body: form });
}
