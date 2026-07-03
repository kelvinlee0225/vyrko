import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateOrdenTrabajoDto {
  @IsUUID()
  @IsOptional()
  cotizacionId?: string;

  @IsUUID()
  @IsOptional()
  vehiculoId?: string;

  @IsUUID()
  @IsOptional()
  tecnicoId?: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsDateString()
  @IsOptional()
  fechaEntrada?: string;

  @IsDateString()
  @IsOptional()
  fechaEntregaEstimada?: string;

  @IsDateString()
  @IsOptional()
  fechaEntregaReal?: string;

  @IsString()
  @IsOptional()
  descripcionTrabajo?: string;
}
