import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class UpdateCotizacionDto {
  @IsUUID()
  @IsOptional()
  clienteId?: string;

  @IsUUID()
  @IsOptional()
  vehiculoId?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsDateString()
  @IsOptional()
  fechaValidez?: string;

  @IsNumberString()
  @IsOptional()
  descuentoGlobal?: string;

  @IsString()
  @IsOptional()
  notas?: string;
}
