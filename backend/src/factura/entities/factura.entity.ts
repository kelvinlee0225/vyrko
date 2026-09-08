import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Cliente } from '../../cliente/entities/cliente.entity';
import { Vehiculo } from '../../vehiculo/entities/vehiculo.entity';
import { Cotizacion } from '../../cotizacion/entities/cotizacion.entity';
import { OrdenTrabajo } from '../../orden-trabajo/entities/orden-trabajo.entity';
import { FacturaLinea } from './factura-linea.entity';
import { EstadoFactura } from '../enums/estado-factura.enum';
import { TipoECF } from '../enums/tipo-ecf.enum';
import { EstadoDgii } from '../enums/estado-dgii.enum';

@Entity('factura')
export class Factura {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Cliente)
  @JoinColumn({ name: 'cliente_id' })
  cliente: Cliente;

  @ManyToOne(() => Vehiculo, { nullable: true })
  @JoinColumn({ name: 'vehiculo_id' })
  vehiculo: Vehiculo | null;

  @ManyToOne(() => Cotizacion, { nullable: true })
  @JoinColumn({ name: 'cotizacion_id' })
  cotizacion: Cotizacion | null;

  @ManyToOne(() => OrdenTrabajo, { nullable: true })
  @JoinColumn({ name: 'orden_trabajo_id' })
  ordenTrabajo: OrdenTrabajo | null;

  @Column({ type: 'varchar', unique: true })
  numero: string;

  @Column({
    type: 'enum',
    enum: EstadoFactura,
    default: EstadoFactura.PENDIENTE,
  })
  estado: EstadoFactura;

  @Column({ type: 'date', name: 'fecha_emision' })
  fechaEmision: string;

  @Column({ type: 'date', name: 'fecha_vencimiento', nullable: true })
  fechaVencimiento: string | null;

  @Column({ type: 'varchar', name: 'metodo_pago', nullable: true })
  metodoPago: string | null;

  @Column({ type: 'date', name: 'fecha_pago', nullable: true })
  fechaPago: string | null;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'monto_pagado',
    default: 0,
  })
  montoPagado: string;

  @Column({
    type: 'decimal',
    precision: 12,
    scale: 2,
    name: 'descuento_global',
    nullable: true,
  })
  descuentoGlobal: string | null;

  @Column({ type: 'text', nullable: true })
  notas: string | null;

  @OneToMany(() => FacturaLinea, (linea) => linea.factura)
  lineas: FacturaLinea[];

  /** Which e-CF document type this invoice is fiscally classified as; null = not fiscal. */
  @Column({ type: 'int', name: 'tipo_ecf', nullable: true })
  tipoECF: TipoECF | null;

  /** DGII-assigned electronic sequence number, set on first submission. */
  @Column({ type: 'varchar', name: 'e_ncf', unique: true, nullable: true })
  eNCF: string | null;

  /** First 6 hex chars of SHA-256(SignatureValue) — see EcfSignerService.computeCodigoSeguridad. */
  @Column({ type: 'varchar', name: 'codigo_seguridad', nullable: true })
  codigoSeguridad: string | null;

  @Column({ type: 'timestamptz', name: 'fecha_firma', nullable: true })
  fechaFirma: Date | null;

  /**
   * The signed e-CF XML actually submitted to DGII, retained per DGII's
   * requirement even when only a summary (RFCE) was transmitted. Simple
   * text column for now; see docs/AWS_DEPLOYMENT.md §6 for the planned
   * move to S3 at AWS deploy time.
   */
  @Column({ type: 'text', name: 'xml_generado', nullable: true })
  xmlGenerado: string | null;

  @Column({
    type: 'enum',
    enum: EstadoDgii,
    name: 'estado_dgii',
    nullable: true,
  })
  estadoDgii: EstadoDgii | null;

  @Column({ type: 'varchar', name: 'track_id', nullable: true })
  trackId: string | null;

  /** JSON-stringified array of {codigo, valor} messages from DGII's responses. */
  @Column({ type: 'text', name: 'mensajes_dgii', nullable: true })
  mensajesDgii: string | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
