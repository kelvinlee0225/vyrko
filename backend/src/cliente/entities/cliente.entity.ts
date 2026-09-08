import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { TipoIdentificacion } from '../enums/tipo-identificacion.enum';

@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'nombre_razon_social' })
  nombreRazonSocial: string;

  @Column({ type: 'varchar', name: 'tipo_cliente' })
  tipoCliente: string;

  @Column({ type: 'boolean', name: 'es_aseguradora', default: false })
  esAseguradora: boolean;

  @Column({ type: 'varchar', name: 'numero_identificacion', nullable: true })
  numeroIdentificacion: string | null;

  @Column({
    type: 'enum',
    enum: TipoIdentificacion,
    name: 'tipo_identificacion',
    default: TipoIdentificacion.NINGUNA,
  })
  tipoIdentificacion: TipoIdentificacion;

  @Column({ type: 'varchar' })
  telefono: string;

  @Column({ type: 'varchar', nullable: true })
  correo: string | null;

  @Column({ type: 'varchar', nullable: true })
  direccion: string | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'limite_credito',
    nullable: true,
  })
  limiteCredito: string | null;

  @Column({ type: 'int', name: 'dias_credito', nullable: true })
  diasCredito: number | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
