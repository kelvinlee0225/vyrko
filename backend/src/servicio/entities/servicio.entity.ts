import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('servicio')
export class Servicio {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', name: 'tipo_trabajo' })
  tipoTrabajo: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'precio_base' })
  precioBase: string;

  @Column({ type: 'boolean', name: 'lleva_itbis', default: true })
  llevaItbis: boolean;
}
