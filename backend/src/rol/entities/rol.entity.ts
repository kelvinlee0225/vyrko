import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('rol')
export class Rol {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  nombre: string;
}
