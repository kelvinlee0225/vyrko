import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { CreateMovimientoInventarioDto } from './dto/create-movimiento-inventario.dto';
import { MaterialService } from '../material/material.service';
import { ProveedorService } from '../proveedor/proveedor.service';
import { UsuarioService } from '../usuario/usuario.service';

const MOVIMIENTO_RELATIONS = {
  material: true,
  proveedor: true,
  usuario: true,
} as const;

@Injectable()
export class MovimientoInventarioService {
  constructor(
    @InjectRepository(MovimientoInventario)
    private readonly movimientoInventarioRepository: Repository<MovimientoInventario>,
    private readonly materialService: MaterialService,
    private readonly proveedorService: ProveedorService,
    private readonly usuarioService: UsuarioService,
  ) {}

  async create(
    createMovimientoInventarioDto: CreateMovimientoInventarioDto,
    usuarioId: string,
  ): Promise<MovimientoInventario> {
    const { materialId, proveedorId, ...rest } = createMovimientoInventarioDto;
    const material = await this.materialService.findOne(materialId);
    const proveedor = proveedorId
      ? await this.proveedorService.findOne(proveedorId)
      : null;
    const usuario = await this.usuarioService.findOne(usuarioId);

    const delta =
      rest.tipoMovimiento === 'entrada'
        ? parseFloat(rest.cantidad)
        : -parseFloat(rest.cantidad);
    await this.materialService.adjustStock(material.id, delta);

    return this.movimientoInventarioRepository.save(
      this.movimientoInventarioRepository.create({
        ...rest,
        material,
        proveedor,
        usuario,
      }),
    );
  }

  findAll(): Promise<MovimientoInventario[]> {
    return this.movimientoInventarioRepository.find({
      relations: MOVIMIENTO_RELATIONS,
    });
  }

  async findOne(id: string): Promise<MovimientoInventario> {
    const movimiento = await this.movimientoInventarioRepository.findOne({
      where: { id },
      relations: MOVIMIENTO_RELATIONS,
    });
    if (!movimiento) {
      throw new NotFoundException(
        `Movimiento de inventario ${id} no encontrado`,
      );
    }
    return movimiento;
  }
}
