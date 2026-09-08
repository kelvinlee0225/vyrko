import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('secuencia_ncf')
export class SecuenciaNcf {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'int', name: 'tipo_ecf' })
  tipoECF: number;

  @Column({ type: 'int' })
  desde: number;

  @Column({ type: 'int' })
  hasta: number;

  /** Next e-NCF number to be issued from this range. */
  @Column({ type: 'int' })
  actual: number;

  /** DGII authorizes some ranges (e.g. tipo 32) with no expiration. */
  @Column({ type: 'date', name: 'fecha_vencimiento', nullable: true })
  fechaVencimiento: string | null;

  @Column({ type: 'boolean', default: true })
  activa: boolean;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
