import { IsNumberString, IsOptional, IsString, IsUUID } from 'class-validator';

export class UpdateFacturaLineaDto {
  @IsUUID()
  @IsOptional()
  servicioId?: string;

  @IsUUID()
  @IsOptional()
  piezaId?: string;

  @IsString()
  @IsOptional()
  descripcion?: string;

  @IsNumberString()
  @IsOptional()
  cantidad?: string;

  @IsNumberString()
  @IsOptional()
  precioUnitario?: string;

  @IsNumberString()
  @IsOptional()
  itbis?: string;

  @IsNumberString()
  @IsOptional()
  descuento?: string;
}
