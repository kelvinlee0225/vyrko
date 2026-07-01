import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { ClienteService } from '../cliente/cliente.service';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    private readonly clienteService: ClienteService,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const { clienteId, ...rest } = createVehiculoDto;
    const cliente = await this.clienteService.findOne(clienteId);
    return this.vehiculoRepository.save(
      this.vehiculoRepository.create({ ...rest, cliente }),
    );
  }

  findAll(): Promise<Vehiculo[]> {
    return this.vehiculoRepository.find({ relations: { cliente: true } });
  }

  async findOne(id: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id },
      relations: { cliente: true },
    });
    if (!vehiculo) {
      throw new NotFoundException(`Vehiculo ${id} no encontrado`);
    }
    return vehiculo;
  }

  async update(
    id: string,
    updateVehiculoDto: UpdateVehiculoDto,
  ): Promise<Vehiculo> {
    const vehiculo = await this.findOne(id);
    const { clienteId, ...rest } = updateVehiculoDto;
    if (clienteId) {
      vehiculo.cliente = await this.clienteService.findOne(clienteId);
    }
    Object.assign(vehiculo, rest);
    return this.vehiculoRepository.save(vehiculo);
  }

  async remove(id: string): Promise<void> {
    const vehiculo = await this.findOne(id);
    await this.vehiculoRepository.remove(vehiculo);
  }
}
