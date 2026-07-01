import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity('cliente')
export class Cliente {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', name: 'nombre_razon_social' })
  nombreRazonSocial: string;

  @Column({ type: 'varchar', name: 'tipo_cliente' })
  tipoCliente: string;

  @Column({ type: 'varchar', name: 'cedula_rnc', nullable: true })
  cedulaRnc: string | null;

  @Column({ type: 'varchar' })
  telefono: string;

  @Column({ type: 'varchar', nullable: true })
  correo: string | null;

  @Column({ type: 'varchar', nullable: true })
  direccion: string | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'limite_credito',
    nullable: true,
  })
  limiteCredito: string | null;

  @Column({ type: 'int', name: 'dias_credito', nullable: true })
  diasCredito: number | null;
}
