import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Servicio } from '../../servicio/entities/servicio.entity';
import { Pieza } from '../../pieza/entities/pieza.entity';
import { Cotizacion } from './cotizacion.entity';

@Entity('cotizacion_linea')
export class CotizacionLinea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Cotizacion, (cotizacion) => cotizacion.lineas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion: Cotizacion;

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: 'servicio_id' })
  servicio: Servicio;

  @ManyToOne(() => Pieza, { nullable: true })
  @JoinColumn({ name: 'pieza_id' })
  pieza: Pieza | null;

  @Column({ type: 'varchar' })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'precio_unitario' })
  precioUnitario: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  itbis: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  descuento: string | null;
}
