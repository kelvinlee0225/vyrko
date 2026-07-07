import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'varchar', name: 'nombre_razon_social' })
  nombreRazonSocial: string;

  @Column({ type: 'varchar', name: 'tipo_cliente' })
  tipoCliente: string;

  @Column({ type: 'boolean', name: 'es_aseguradora', default: false })
  esAseguradora: boolean;

  @Column({ type: 'varchar', name: 'cedula_rnc', nullable: true })
  cedulaRnc: string | null;

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
}
