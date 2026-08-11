import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { SecuenciaNcf } from './entities/secuencia-ncf.entity';
import { CreateSecuenciaNcfDto } from './dto/create-secuencia-ncf.dto';

@Injectable()
export class SecuenciaNcfService {
  constructor(
    @InjectRepository(SecuenciaNcf)
    private readonly secuenciaNcfRepository: Repository<SecuenciaNcf>,
    @InjectDataSource()
    private readonly dataSource: DataSource,
  ) {}

  create(dto: CreateSecuenciaNcfDto): Promise<SecuenciaNcf> {
    if (dto.desde > dto.hasta) {
      throw new BadRequestException(
        'El rango "desde" debe ser menor o igual a "hasta"',
      );
    }
    return this.secuenciaNcfRepository.save(
      this.secuenciaNcfRepository.create({
        tipoECF: dto.tipoECF,
        desde: dto.desde,
        hasta: dto.hasta,
        actual: dto.desde,
        fechaVencimiento: dto.fechaVencimiento ?? null,
        activa: true,
      }),
    );
  }

  findAll(): Promise<SecuenciaNcf[]> {
    return this.secuenciaNcfRepository.find({
      order: { tipoECF: 'ASC', createdAt: 'ASC' },
    });
  }

  /**
   * Atomically hands out the next e-NCF from an authorized range for
   * tipoECF, formatted per DGII's eNCFValidationType: E + 2-digit tipo +
   * 10-digit zero-padded sequence (13 chars total). Also returns the
   * range's fechaVencimiento — required in the XML itself for e-CF type 31
   * (IdDoc/FechaVencimientoSecuencia, minOccurs=1 per the XSD).
   */
  async getNextENCF(
    tipoECF: number,
  ): Promise<{ eNCF: string; fechaVencimientoSecuencia: string | null }> {
    return this.dataSource.transaction(async (manager) => {
      const hoy = new Date().toISOString().slice(0, 10);
      const secuencia = await manager
        .createQueryBuilder(SecuenciaNcf, 'secuencia')
        .setLock('pessimistic_write')
        .where('secuencia.tipo_ecf = :tipoECF', { tipoECF })
        .andWhere('secuencia.activa = true')
        .andWhere('secuencia.actual <= secuencia.hasta')
        .andWhere(
          '(secuencia.fecha_vencimiento IS NULL OR secuencia.fecha_vencimiento >= :hoy)',
          { hoy },
        )
        .orderBy('secuencia.created_at', 'ASC')
        .getOne();

      if (!secuencia) {
        throw new BadRequestException(
          `No hay secuencias de e-NCF disponibles para el tipo e-CF ${tipoECF}. Solicite un nuevo rango a la DGII.`,
        );
      }

      const numero = secuencia.actual;
      secuencia.actual += 1;
      if (secuencia.actual > secuencia.hasta) {
        secuencia.activa = false;
      }
      await manager.save(secuencia);

      return {
        eNCF: `E${String(tipoECF).padStart(2, '0')}${String(numero).padStart(10, '0')}`,
        fechaVencimientoSecuencia: secuencia.fechaVencimiento,
      };
    });
  }
}
