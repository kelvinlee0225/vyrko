import {
  IsIn,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMovimientoInventarioDto {
  @IsUUID()
  materialId: string;

  @IsUUID()
  @IsOptional()
  proveedorId?: string;

  @IsIn(['entrada', 'salida'])
  tipoMovimiento: 'entrada' | 'salida';

  @IsNumberString()
  cantidad: string;

  @IsString()
  @IsOptional()
  motivo?: string;
}
