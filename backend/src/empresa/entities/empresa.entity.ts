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

  @Column({ type: 'varchar', name: 'nombre_comercial', nullable: true })
  nombreComercial: string | null;

  @Column({ type: 'varchar', nullable: true })
  municipio: string | null;

  @Column({ type: 'varchar', nullable: true })
  provincia: string | null;

  @Column({ type: 'varchar', name: 'actividad_economica', nullable: true })
  actividadEconomica: string | null;

  /**
   * The signing certificate (.p12) and its password live on disk at
   * DGII_CERT_PATH / DGII_CERT_PASSWORD, never in the database — see
   * docs/AWS_DEPLOYMENT.md §3. Which DGII environment to target
   * (precertificacion/certificacion/produccion) is the same kind of
   * deployment concern, read from DGII_AMBIENTE instead of a DB column.
   */

  /** Cached DGII bearer token (DgiiAuthService), refreshed before expiry. */
  @Column({ type: 'text', name: 'dgii_token', nullable: true })
  dgiiToken: string | null;

  @Column({ type: 'timestamptz', name: 'dgii_token_expira', nullable: true })
  dgiiTokenExpira: Date | null;
}
