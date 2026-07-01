import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';

@Entity('vehiculo')
export class Vehiculo {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cliente, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @Column({ type: 'varchar' })
  placa: string;

  @Column({ type: 'varchar' })
  marca: string;

  @Column({ type: 'varchar' })
  modelo: string;

  @Column({ type: 'int' })
  anio: number;

  @Column({ type: 'varchar' })
  color: string;

  @Column({ type: 'varchar', name: 'vin_chasis', nullable: true })
  vinChasis: string | null;
}
