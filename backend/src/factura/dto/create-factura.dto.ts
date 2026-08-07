import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsEnum,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateFacturaLineaDto } from './create-factura-linea.dto';
import { EstadoFactura } from '../enums/estado-factura.enum';
import { TipoECF } from '../enums/tipo-ecf.enum';

export class CreateFacturaDto {
  @IsUUID()
  clienteId: string;

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

  @IsEnum(TipoECF)
  @IsOptional()
  tipoECF?: TipoECF;

  @IsDateString()
  fechaEmision: string;

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;

  @IsNumberString()
  @IsOptional()
  descuentoGlobal?: string;

  @IsString()
  @IsOptional()
  notas?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateFacturaLineaDto)
  lineas: CreateFacturaLineaDto[];
}
