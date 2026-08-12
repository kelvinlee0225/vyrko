import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Factura } from '../factura/entities/factura.entity';
import { EstadoDgii } from '../factura/enums/estado-dgii.enum';
import { EcfSubmissionService } from './ecf-submission.service';

/**
 * Safety net, not the primary reconciliation path — that's the on-demand
 * check in FacturaService.findOneDetail, which covers a factura the moment
 * someone actually looks at it. This sweep only exists to catch a e-CF left
 * in ENVIADO/EN_PROCESO because nobody reopened its detail view. Runs
 * hourly rather than every few minutes: DGII's own docs put average
 * validation at ~200ms, so this is for the rare stuck case, not routine
 * status tracking. When nothing is pending it costs one empty local query.
 */
@Injectable()
export class DgiiPollingService {
  private readonly logger = new Logger(DgiiPollingService.name);

  constructor(
    @InjectRepository(Factura)
    private readonly facturaRepository: Repository<Factura>,
    private readonly ecfSubmissionService: EcfSubmissionService,
  ) {}

  @Cron(CronExpression.EVERY_HOUR)
  async reconciliar(): Promise<void> {
    const pendientes = await this.facturaRepository.find({
      where: { estadoDgii: In([EstadoDgii.ENVIADO, EstadoDgii.EN_PROCESO]) },
    });
    if (pendientes.length === 0) {
      return;
    }

    for (const factura of pendientes) {
      try {
        await this.ecfSubmissionService.consultarResultado(factura);
      } catch (error) {
        this.logger.warn(
          `No se pudo consultar el resultado DGII de la factura ${factura.id}: ${(error as Error).message}`,
        );
      }
    }
  }
}
