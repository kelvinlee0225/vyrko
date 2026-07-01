import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tecnico } from './entities/tecnico.entity';
import { CreateTecnicoDto } from './dto/create-tecnico.dto';
import { UpdateTecnicoDto } from './dto/update-tecnico.dto';

@Injectable()
export class TecnicoService {
  constructor(
    @InjectRepository(Tecnico)
    private readonly tecnicoRepository: Repository<Tecnico>,
  ) {}

  create(createTecnicoDto: CreateTecnicoDto): Promise<Tecnico> {
    return this.tecnicoRepository.save(
      this.tecnicoRepository.create({
        ...createTecnicoDto,
        activo: createTecnicoDto.activo ?? true,
      }),
    );
  }

  findAll(): Promise<Tecnico[]> {
    return this.tecnicoRepository.find();
  }

  async findOne(id: string): Promise<Tecnico> {
    const tecnico = await this.tecnicoRepository.findOne({ where: { id } });
    if (!tecnico) {
      throw new NotFoundException(`Tecnico ${id} no encontrado`);
    }
    return tecnico;
  }

  async update(
    id: string,
    updateTecnicoDto: UpdateTecnicoDto,
  ): Promise<Tecnico> {
    const tecnico = await this.findOne(id);
    Object.assign(tecnico, updateTecnicoDto);
    return this.tecnicoRepository.save(tecnico);
  }

  async remove(id: string): Promise<void> {
    const tecnico = await this.findOne(id);
    await this.tecnicoRepository.remove(tecnico);
  }
}
