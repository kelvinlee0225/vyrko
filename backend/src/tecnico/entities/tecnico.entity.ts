import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('tecnico')
export class Tecnico {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nombre: string;

  @Column({ type: 'boolean' })
  activo: boolean;
}
