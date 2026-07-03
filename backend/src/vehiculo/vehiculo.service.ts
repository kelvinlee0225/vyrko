import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vehiculo } from './entities/vehiculo.entity';
import { CreateVehiculoDto } from './dto/create-vehiculo.dto';
import { UpdateVehiculoDto } from './dto/update-vehiculo.dto';
import { ClienteService } from '../cliente/cliente.service';
import { AseguradoraService } from '../aseguradora/aseguradora.service';

@Injectable()
export class VehiculoService {
  constructor(
    @InjectRepository(Vehiculo)
    private readonly vehiculoRepository: Repository<Vehiculo>,
    private readonly clienteService: ClienteService,
    private readonly aseguradoraService: AseguradoraService,
  ) {}

  async create(createVehiculoDto: CreateVehiculoDto): Promise<Vehiculo> {
    const { clienteId, aseguradoraId, ...rest } = createVehiculoDto;
    const cliente = await this.clienteService.findOne(clienteId);
    const aseguradora = await this.aseguradoraService.findOne(aseguradoraId);
    return this.vehiculoRepository.save(
      this.vehiculoRepository.create({ ...rest, cliente, aseguradora }),
    );
  }

  findAll(): Promise<Vehiculo[]> {
    return this.vehiculoRepository.find({
      relations: { cliente: true, aseguradora: true },
    });
  }

  async findOne(id: string): Promise<Vehiculo> {
    const vehiculo = await this.vehiculoRepository.findOne({
      where: { id },
      relations: { cliente: true, aseguradora: true },
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
    const { clienteId, aseguradoraId, ...rest } = updateVehiculoDto;
    if (clienteId) {
      vehiculo.cliente = await this.clienteService.findOne(clienteId);
    }
    if (aseguradoraId) {
      vehiculo.aseguradora =
        await this.aseguradoraService.findOne(aseguradoraId);
    }
    Object.assign(vehiculo, rest);
    return this.vehiculoRepository.save(vehiculo);
  }

  async remove(id: string): Promise<void> {
    const vehiculo = await this.findOne(id);
    await this.vehiculoRepository.remove(vehiculo);
  }
}
