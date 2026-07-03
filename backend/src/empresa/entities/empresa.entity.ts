import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('empresa')
export class Empresa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar' })
  rnc: string;

  @Column({ type: 'varchar' })
  direccion: string;

  @Column({ type: 'varchar' })
  telefono: string;

  @Column({ type: 'varchar' })
  correo: string;
}
