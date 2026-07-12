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
import { CreateCotizacionLineaDto } from './create-cotizacion-linea.dto';
import { EstadoCotizacion } from '../enums/estado-cotizacion.enum';

export class UpdateCotizacionDto {
  @IsUUID()
  @IsOptional()
  clienteId?: string;

  @IsUUID()
  @IsOptional()
  vehiculoId?: string;

  @IsEnum(EstadoCotizacion)
  @IsOptional()
  estado?: EstadoCotizacion;

  @IsDateString()
  @IsOptional()
  fechaValidez?: string;

  @IsNumberString()
  @IsOptional()
  descuentoGlobal?: string;

  @IsString()
  @IsOptional()
  notas?: string;

  @IsArray()
  @ArrayMinSize(1)
  @ValidateNested({ each: true })
  @Type(() => CreateCotizacionLineaDto)
  @IsOptional()
  lineas?: CreateCotizacionLineaDto[];
}
