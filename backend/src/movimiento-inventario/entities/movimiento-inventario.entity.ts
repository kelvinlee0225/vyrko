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
import { Proveedor } from '../../proveedor/entities/proveedor.entity';
import { Usuario } from '../../usuario/entities/usuario.entity';

@Entity('movimiento_inventario')
export class MovimientoInventario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Material)
  @JoinColumn({ name: 'material_id' })
  material: Material;

  @ManyToOne(() => Proveedor, { nullable: true })
  @JoinColumn({ name: 'proveedor_id' })
  proveedor: Proveedor | null;

  @ManyToOne(() => Usuario)
  @JoinColumn({ name: 'usuario_id' })
  usuario: Usuario;

  @Column({ type: 'varchar', name: 'tipo_movimiento' })
  tipoMovimiento: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: string;

  @Column({ type: 'varchar', nullable: true })
  motivo: string | null;
}
