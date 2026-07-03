import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsOptional,
  IsString,
  IsUUID,
  ValidateNested,
} from 'class-validator';
import { CreateOrdenTrabajoConsumoDto } from './create-orden-trabajo-consumo.dto';

export class CreateOrdenTrabajoDto {
  @IsUUID()
  @IsOptional()
  cotizacionId?: string;

  @IsUUID()
  vehiculoId: string;

  @IsUUID()
  tecnicoId: string;

  @IsString()
  @IsOptional()
  estado?: string;

  @IsDateString()
  fechaEntrada: string;

  @IsDateString()
  @IsOptional()
  fechaEntregaEstimada?: string;

  @IsDateString()
  @IsOptional()
  fechaEntregaReal?: string;

  @IsString()
  @IsOptional()
  descripcionTrabajo?: string;

  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateOrdenTrabajoConsumoDto)
  consumos?: CreateOrdenTrabajoConsumoDto[];
}
