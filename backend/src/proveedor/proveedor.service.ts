import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Proveedor } from './entities/proveedor.entity';
import { CreateProveedorDto } from './dto/create-proveedor.dto';
import { UpdateProveedorDto } from './dto/update-proveedor.dto';

@Injectable()
export class ProveedorService {
  constructor(
    @InjectRepository(Proveedor)
    private readonly proveedorRepository: Repository<Proveedor>,
  ) {}

  create(createProveedorDto: CreateProveedorDto): Promise<Proveedor> {
    return this.proveedorRepository.save(
      this.proveedorRepository.create({
        ...createProveedorDto,
        emiteComprobante: createProveedorDto.emiteComprobante ?? true,
      }),
    );
  }

  findAll(): Promise<Proveedor[]> {
    return this.proveedorRepository.find();
  }

  async findOne(id: string): Promise<Proveedor> {
    const proveedor = await this.proveedorRepository.findOne({
      where: { id },
    });
    if (!proveedor) {
      throw new NotFoundException(`Proveedor ${id} no encontrado`);
    }
    return proveedor;
  }

  async update(
    id: string,
    updateProveedorDto: UpdateProveedorDto,
  ): Promise<Proveedor> {
    const proveedor = await this.findOne(id);
    Object.assign(proveedor, updateProveedorDto);
    return this.proveedorRepository.save(proveedor);
  }

  async remove(id: string): Promise<void> {
    const proveedor = await this.findOne(id);
    await this.proveedorRepository.remove(proveedor);
  }
}
