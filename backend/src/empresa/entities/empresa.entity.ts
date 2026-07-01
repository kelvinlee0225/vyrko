import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('empresa')
export class Empresa {
  @PrimaryGeneratedColumn('uuid')
  id: string;

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
