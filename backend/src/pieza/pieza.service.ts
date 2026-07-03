import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pieza } from './entities/pieza.entity';
import { CreatePiezaDto } from './dto/create-pieza.dto';
import { UpdatePiezaDto } from './dto/update-pieza.dto';

@Injectable()
export class PiezaService {
  constructor(
    @InjectRepository(Pieza)
    private readonly piezaRepository: Repository<Pieza>,
  ) {}

  create(createPiezaDto: CreatePiezaDto): Promise<Pieza> {
    return this.piezaRepository.save(
      this.piezaRepository.create(createPiezaDto),
    );
  }

  findAll(): Promise<Pieza[]> {
    return this.piezaRepository.find();
  }

  async findOne(id: string): Promise<Pieza> {
    const pieza = await this.piezaRepository.findOne({ where: { id } });
    if (!pieza) {
      throw new NotFoundException(`Pieza ${id} no encontrada`);
    }
    return pieza;
  }

  async update(id: string, updatePiezaDto: UpdatePiezaDto): Promise<Pieza> {
    const pieza = await this.findOne(id);
    Object.assign(pieza, updatePiezaDto);
    return this.piezaRepository.save(pieza);
  }

  async remove(id: string): Promise<void> {
    const pieza = await this.findOne(id);
    await this.piezaRepository.remove(pieza);
  }
}
