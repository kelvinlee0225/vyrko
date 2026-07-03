import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Rol } from '../../rol/entities/rol.entity';

@Entity('usuario')
export class Usuario {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @ManyToOne(() => Rol)
  @JoinColumn({ name: 'rol_id' })
  rol: Rol;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar', name: 'password_hash', select: false })
  passwordHash: string;

  @Column({ type: 'boolean', default: true })
  activo: boolean;
}
