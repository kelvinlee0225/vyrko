import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Servicio } from '../../servicio/entities/servicio.entity';
import { Pieza } from '../../pieza/entities/pieza.entity';
import { Factura } from './factura.entity';
import { IndicadorFacturacion } from '../enums/indicador-facturacion.enum';

@Entity('factura_linea')
export class FacturaLinea {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Factura, (factura) => factura.lineas, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'factura_id' })
  factura: Factura;

  @ManyToOne(() => Servicio)
  @JoinColumn({ name: 'servicio_id' })
  servicio: Servicio;

  @ManyToOne(() => Pieza, { nullable: true })
  @JoinColumn({ name: 'pieza_id' })
  pieza: Pieza | null;

  @Column({ type: 'varchar' })
  descripcion: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  cantidad: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, name: 'precio_unitario' })
  precioUnitario: string;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  itbis: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  descuento: string | null;

  /**
   * DGII e-CF tax classification for this line. Auto-set to ITBIS_18 when
   * itbis > 0; left null for untaxed lines until explicitly classified —
   * DGII's Exento/0%/No Facturable codes carry distinct legal meaning that
   * can't be inferred from today's llevaItbis boolean.
   */
  @Column({ type: 'int', name: 'indicador_facturacion', nullable: true })
  indicadorFacturacion: IndicadorFacturacion | null;

  @CreateDateColumn({ type: 'timestamptz', name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ type: 'timestamptz', name: 'updated_at' })
  updatedAt: Date;
}
