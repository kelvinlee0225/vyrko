import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Material } from '../../material/entities/material.entity';
import { OrdenTrabajo } from './orden-trabajo.entity';

@Entity('orden_trabajo_consumo')
export class OrdenTrabajoConsumo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => OrdenTrabajo, (ordenTrabajo) => ordenTrabajo.consumos, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orden_trabajo_id' })
  ordenTrabajo: OrdenTrabajo;

  @ManyToOne(() => Material)
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @Column({ type: 'decimal', precision: 10, scale: 2, name: 'cantidad_real' })
  cantidadReal: string;
}
