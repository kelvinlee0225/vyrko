import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Aseguradora } from '../../aseguradora/entities/aseguradora.entity';

@Entity('vehiculo')
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Cliente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Aseguradora)
  @JoinColumn({ name: 'aseguradora_id' })
  aseguradora: Aseguradora;

  @Column({ type: 'varchar' })
  placa: string;

  @Column({ type: 'varchar' })
  marca: string;

  @Column({ type: 'varchar' })
  modelo: string;

  @Column({ type: 'int' })
  año: number;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'varchar', name: 'vin_chasis', nullable: true })
  vinChasis: string | null;
}
