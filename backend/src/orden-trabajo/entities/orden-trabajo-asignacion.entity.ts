import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Tecnico } from '../../tecnico/entities/tecnico.entity';
import { OrdenTrabajo } from './orden-trabajo.entity';

@Entity('orden_trabajo_asignacion')
export class OrdenTrabajoAsignacion {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => OrdenTrabajo, (ordenTrabajo) => ordenTrabajo.asignaciones, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'orden_trabajo_id' })
  ordenTrabajo: OrdenTrabajo;

  @ManyToOne(() => Tecnico)
  @JoinColumn({ name: 'tecnico_id' })
  tecnico: Tecnico;

  @CreateDateColumn({ type: 'timestamp', name: 'asignado_en' })
  asignadoEn: Date;

  @Column({ type: 'varchar', nullable: true })
  notas: string | null;
}
