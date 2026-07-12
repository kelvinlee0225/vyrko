import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';
import { CotizacionLinea } from './cotizacion-linea.entity';
import { EstadoCotizacion } from '../enums/estado-cotizacion.enum';

@Entity('cotizacion')
export class Cotizacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Vehiculo)
  @JoinColumn({ name: 'vehiculo_id' })
  vehiculo: Vehiculo;

  @Column({ type: 'varchar', unique: true })
  numero: string;

  @Column({
    type: 'enum',
    enum: EstadoCotizacion,
    default: EstadoCotizacion.BORRADOR,
  })
  estado: EstadoCotizacion;

  @Column({ type: 'date', name: 'fecha_validez' })
  fechaValidez: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'descuento_global',
    nullable: true,
  })
  descuentoGlobal: string | null;

  @Column({ type: 'text', nullable: true })
  notas: string | null;

  @OneToMany(() => CotizacionLinea, (linea) => linea.cotizacion)
  lineas: CotizacionLinea[];
}
