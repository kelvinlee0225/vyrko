import {
  IsDateString,
  IsEnum,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';
import { EstadoOrdenTrabajo } from '../enums/estado-orden-trabajo.enum';

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

  @IsEnum(EstadoOrdenTrabajo)
  @IsOptional()
  estado?: EstadoOrdenTrabajo;

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
