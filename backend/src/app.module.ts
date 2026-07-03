import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RolModule } from './rol/rol.module';
import { UsuarioModule } from './usuario/usuario.module';
import { ClienteModule } from './cliente/cliente.module';
import { VehiculoModule } from './vehiculo/vehiculo.module';
import { AseguradoraModule } from './aseguradora/aseguradora.module';
import { TecnicoModule } from './tecnico/tecnico.module';
import { EmpresaModule } from './empresa/empresa.module';
import { CategoriaMaterialModule } from './categoria-material/categoria-material.module';
import { MaterialModule } from './material/material.module';
import { ProveedorModule } from './proveedor/proveedor.module';
import { ServicioModule } from './servicio/servicio.module';
import { PiezaModule } from './pieza/pieza.module';
import { CotizacionModule } from './cotizacion/cotizacion.module';
import { OrdenTrabajoModule } from './orden-trabajo/orden-trabajo.module';
import { MovimientoInventarioModule } from './movimiento-inventario/movimiento-inventario.module';
import { AuthModule } from './auth/auth.module';
import { JwtAuthGuard } from './auth/guards/jwt-auth.guard';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        type: 'postgres',
        host: config.get<string>('DB_HOST'),
        port: config.get<number>('DB_PORT'),
        username: config.get<string>('DB_USERNAME'),
        password: config.get<string>('DB_PASSWORD'),
        database: config.get<string>('DB_NAME'),
        autoLoadEntities: true,
        synchronize: false,
      }),
    }),
    RolModule,
    UsuarioModule,
    ClienteModule,
    VehiculoModule,
    AseguradoraModule,
    TecnicoModule,
    EmpresaModule,
    CategoriaMaterialModule,
    MaterialModule,
    ProveedorModule,
    ServicioModule,
    PiezaModule,
    CotizacionModule,
    OrdenTrabajoModule,
    MovimientoInventarioModule,
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
  ],
})
export class AppModule {}
