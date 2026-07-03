import { Type } from 'class-transformer';
import {
  ArrayMinSize,
  IsArray,
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateCotizacionLineaDto } from './create-cotizacion-linea.dto';

export class CreateCotizacionDto {
  @IsUUID()
  clienteId: string;

  @IsUUID()
  vehiculoId: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsDateString()
  fechaValidez: string;

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
  lineas: CreateCotizacionLineaDto[];
}
