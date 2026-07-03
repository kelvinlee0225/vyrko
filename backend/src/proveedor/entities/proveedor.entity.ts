import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('proveedor')
export class Proveedor {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @CreateDateColumn({ type: 'timestamp', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamp', name: 'updated_at' })
  updatedAt: Date;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'varchar', name: 'rnc_cedula', nullable: true })
  rncCedula: string | null;

  @Column({ type: 'varchar', nullable: true })
  telefono: string | null;

  @Column({ type: 'varchar', nullable: true })
  correo: string | null;

  @Column({ type: 'varchar', nullable: true })
  direccion: string | null;

  @Column({ type: 'varchar', nullable: true })
  contacto: string | null;

  @Column({ type: 'boolean', name: 'emite_comprobante', default: true })
  emiteComprobante: boolean;
}
