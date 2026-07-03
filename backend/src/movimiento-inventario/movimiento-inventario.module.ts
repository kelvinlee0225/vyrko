import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MovimientoInventario } from './entities/movimiento-inventario.entity';
import { MovimientoInventarioService } from './movimiento-inventario.service';
import { MovimientoInventarioController } from './movimiento-inventario.controller';
import { MaterialModule } from '../material/material.module';
import { ProveedorModule } from '../proveedor/proveedor.module';
import { UsuarioModule } from '../usuario/usuario.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MovimientoInventario]),
    MaterialModule,
    ProveedorModule,
    UsuarioModule,
  ],
  controllers: [MovimientoInventarioController],
  providers: [MovimientoInventarioService],
  exports: [MovimientoInventarioService],
})
export class MovimientoInventarioModule {}
