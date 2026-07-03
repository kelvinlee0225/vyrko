import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Aseguradora } from './entities/aseguradora.entity';
import { CreateAseguradoraDto } from './dto/create-aseguradora.dto';
import { UpdateAseguradoraDto } from './dto/update-aseguradora.dto';

@Injectable()
export class AseguradoraService {
  constructor(
    @InjectRepository(Aseguradora)
    private readonly aseguradoraRepository: Repository<Aseguradora>,
  ) {}

  create(createAseguradoraDto: CreateAseguradoraDto): Promise<Aseguradora> {
    return this.aseguradoraRepository.save(
      this.aseguradoraRepository.create(createAseguradoraDto),
    );
  }

  findAll(): Promise<Aseguradora[]> {
    return this.aseguradoraRepository.find();
  }

  async findOne(id: string): Promise<Aseguradora> {
    const aseguradora = await this.aseguradoraRepository.findOne({
      where: { id },
    });
    if (!aseguradora) {
      throw new NotFoundException(`Aseguradora ${id} no encontrada`);
    }
    return aseguradora;
  }

  async update(
    id: string,
    updateAseguradoraDto: UpdateAseguradoraDto,
  ): Promise<Aseguradora> {
    const aseguradora = await this.findOne(id);
    Object.assign(aseguradora, updateAseguradoraDto);
    return this.aseguradoraRepository.save(aseguradora);
  }

  async remove(id: string): Promise<void> {
    const aseguradora = await this.findOne(id);
    await this.aseguradoraRepository.remove(aseguradora);
  }
}
