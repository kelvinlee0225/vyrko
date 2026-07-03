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
import { Cotizacion } from '../../cotizacion/entities/cotizacion.entity';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';
import { Tecnico } from '../../tecnico/entities/tecnico.entity';
import { OrdenTrabajoConsumo } from './orden-trabajo-consumo.entity';

@Entity('orden_trabajo')
export class OrdenTrabajo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Cotizacion, { nullable: true })
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion: Cotizacion | null;

  @ManyToOne(() => Vehiculo)
  @JoinColumn({ name: 'vehiculo_id' })
  vehiculo: Vehiculo;

  @ManyToOne(() => Tecnico)
  @JoinColumn({ name: 'tecnico_id' })
  tecnico: Tecnico;

  @Column({ type: 'varchar', default: 'recibido' })
  estado: string;

  @Column({ type: 'date', name: 'fecha_entrada' })
  fechaEntrada: string;

  @Column({ type: 'date', name: 'fecha_entrega_estimada', nullable: true })
  fechaEntregaEstimada: string | null;

  @Column({ type: 'date', name: 'fecha_entrega_real', nullable: true })
  fechaEntregaReal: string | null;

  @Column({ type: 'text', name: 'descripcion_trabajo', nullable: true })
  descripcionTrabajo: string | null;

  @OneToMany(() => OrdenTrabajoConsumo, (consumo) => consumo.ordenTrabajo)
  consumos: OrdenTrabajoConsumo[];
}
