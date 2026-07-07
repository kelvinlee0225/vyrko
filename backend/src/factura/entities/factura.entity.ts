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
import { Cotizacion } from '../../cotizacion/entities/cotizacion.entity';
import { OrdenTrabajo } from '../../orden-trabajo/entities/orden-trabajo.entity';
import { FacturaLinea } from './factura-linea.entity';

@Entity('factura')
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Vehiculo, { nullable: true })
  @JoinColumn({ name: 'vehiculo_id' })
  vehiculo: Vehiculo | null;

  @ManyToOne(() => Cotizacion, { nullable: true })
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion: Cotizacion | null;

  @ManyToOne(() => OrdenTrabajo, { nullable: true })
  @JoinColumn({ name: 'orden_trabajo_id' })
  ordenTrabajo: OrdenTrabajo | null;

  @Column({ type: 'varchar', unique: true })
  numero: string;

  @Column({ type: 'varchar', default: 'pendiente' })
  estado: string;

  @Column({ type: 'date', name: 'fecha_emision' })
  fechaEmision: string;

  @Column({ type: 'date', name: 'fecha_vencimiento', nullable: true })
  fechaVencimiento: string | null;

  @Column({ type: 'varchar', name: 'metodo_pago', nullable: true })
  metodoPago: string | null;

  @Column({ type: 'date', name: 'fecha_pago', nullable: true })
  fechaPago: string | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'monto_pagado',
    default: 0,
  })
  montoPagado: string;

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

  @OneToMany(() => FacturaLinea, (linea) => linea.factura)
  lineas: FacturaLinea[];
}
