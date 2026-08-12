import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from '../empresa/entities/empresa.entity';
import { EcfSignerService } from './ecf-signer.service';
import {
  DGII_ECF_HOST,
  getAmbienteDgii,
  postXmlMultipart,
  resolveAmbienteSegmento,
} from './dgii-http.util';

/** Refresh ahead of DGII's own expiry so a request never races an already-expired token. */
const REFRESH_BUFFER_MS = 5 * 60 * 1000;

interface RespuestaAutenticacion {
  token: string;
  expira: string;
  expedido: string;
}

/**
 * DGII's auth flow is a challenge/response, not a login: GET a random
 * "semilla" (seed) XML, sign it with the same certificate used for e-CF
 * (proves possession of the private key tied to the registered RNC), POST
 * the signed semilla to validarsemilla, and DGII returns a Bearer token
 * (~1h TTL) used on every other e-CF web service call.
 * Source: e-cf/Descripcion_20Tecnica_20Servicios_20DGII.pdf, "Autenticacion".
 */
@Injectable()
export class DgiiAuthService {
  constructor(
    private readonly config: ConfigService,
    private readonly signer: EcfSignerService,
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async getToken(empresa: Empresa): Promise<string> {
    if (
      empresa.dgiiToken &&
      empresa.dgiiTokenExpira &&
      empresa.dgiiTokenExpira.getTime() - REFRESH_BUFFER_MS > Date.now()
    ) {
      return empresa.dgiiToken;
    }
    return this.refreshToken(empresa);
  }

  private async refreshToken(empresa: Empresa): Promise<string> {
    const ambiente = getAmbienteDgii(this.config);
    const base = `${DGII_ECF_HOST}/${resolveAmbienteSegmento(ambiente)}/autenticacion/api/autenticacion`;

    const semillaResponse = await fetch(`${base}/semilla`, {
      headers: { accept: '*/*' },
    });
    if (!semillaResponse.ok) {
      throw new InternalServerErrorException(
        `DGII rechazo la solicitud de semilla (HTTP ${semillaResponse.status})`,
      );
    }
    const semillaFirmada = this.signer.sign(await semillaResponse.text());

    const validarResponse = await postXmlMultipart(
      `${base}/validarsemilla`,
      semillaFirmada,
      'semilla.xml',
    );
    if (!validarResponse.ok) {
      throw new InternalServerErrorException(
        `DGII rechazo la semilla firmada (HTTP ${validarResponse.status}): ${await validarResponse.text()}`,
      );
    }

    const { token, expira } =
      (await validarResponse.json()) as RespuestaAutenticacion;

    empresa.dgiiToken = token;
    empresa.dgiiTokenExpira = new Date(expira);
    await this.empresaRepository.save(empresa);

    return token;
  }
}
