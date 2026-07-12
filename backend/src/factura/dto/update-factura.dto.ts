import {
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EstadoFactura } from '../enums/estado-factura.enum';

export class UpdateFacturaDto {
  @IsUUID()
  @IsOptional()
  clienteId?: string;

  @IsUUID()
  @IsOptional()
  vehiculoId?: string;

  @IsUUID()
  @IsOptional()
  cotizacionId?: string;

  @IsUUID()
  @IsOptional()
  ordenTrabajoId?: string;

  @IsEnum(EstadoFactura)
  @IsOptional()
  estado?: EstadoFactura;

  @IsDateString()
  @IsOptional()
  fechaEmision?: string;

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;

  @IsNumberString()
  @IsOptional()
  descuentoGlobal?: string;

  @IsString()
  @IsOptional()
  notas?: string;
}
