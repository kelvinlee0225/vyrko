import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Empresa } from './entities/empresa.entity';
import { UpsertEmpresaDto } from './dto/upsert-empresa.dto';

@Injectable()
export class EmpresaService {
  constructor(
    @InjectRepository(Empresa)
    private readonly empresaRepository: Repository<Empresa>,
  ) {}

  async find(): Promise<Empresa> {
    const [empresa] = await this.empresaRepository.find({ take: 1 });
    if (!empresa) {
      throw new NotFoundException('La empresa aun no ha sido configurada');
    }
    return empresa;
  }

  async upsert(upsertEmpresaDto: UpsertEmpresaDto): Promise<Empresa> {
    const [existing] = await this.empresaRepository.find({ take: 1 });
    const empresa = existing
      ? Object.assign(existing, upsertEmpresaDto)
      : this.empresaRepository.create(upsertEmpresaDto);
    return this.empresaRepository.save(empresa);
  }
}
