import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { CategoriaMaterial } from '../../categoria-material/entities/categoria-material.entity';

@Entity('material')
export class Material {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => CategoriaMaterial)
  @JoinColumn({ name: 'categoria_id' })
  categoria: CategoriaMaterial;

  @Column({ type: 'varchar', unique: true })
  codigo: string;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'precio_costo' })
  precioCosto: string;

  @Column({
    type: 'decimal',
    precision: 10,
    scale: 2,
    name: 'stock_actual',
    default: 0,
  })
  stockActual: string;

  @Column({ type: 'int', name: 'stock_minimo', default: 0 })
  stockMinimo: number;
}
