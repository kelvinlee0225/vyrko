import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateFacturaFromCotizacionDto {
  @IsUUID()
  @IsOptional()
  ordenTrabajoId?: string;

  @IsDateString()
  @IsOptional()
  fechaEmision?: string;

  @IsDateString()
  @IsOptional()
  fechaVencimiento?: string;

  @IsString()
  @IsOptional()
  notas?: string;
}
