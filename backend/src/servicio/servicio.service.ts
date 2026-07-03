import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Servicio } from './entities/servicio.entity';
import { CreateServicioDto } from './dto/create-servicio.dto';
import { UpdateServicioDto } from './dto/update-servicio.dto';

@Injectable()
export class ServicioService {
  constructor(
    @InjectRepository(Servicio)
    private readonly servicioRepository: Repository<Servicio>,
  ) {}

  create(createServicioDto: CreateServicioDto): Promise<Servicio> {
    return this.servicioRepository.save(
      this.servicioRepository.create({
        ...createServicioDto,
        llevaItbis: createServicioDto.llevaItbis ?? true,
      }),
    );
  }

  findAll(): Promise<Servicio[]> {
    return this.servicioRepository.find();
  }

  async findOne(id: string): Promise<Servicio> {
    const servicio = await this.servicioRepository.findOne({
      where: { id },
    });
    if (!servicio) {
      throw new NotFoundException(`Servicio ${id} no encontrado`);
    }
    return servicio;
  }

  async update(
    id: string,
    updateServicioDto: UpdateServicioDto,
  ): Promise<Servicio> {
    const servicio = await this.findOne(id);
    Object.assign(servicio, updateServicioDto);
    return this.servicioRepository.save(servicio);
  }

  async remove(id: string): Promise<void> {
    const servicio = await this.findOne(id);
    await this.servicioRepository.remove(servicio);
  }
}
