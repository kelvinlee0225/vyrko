import {
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateFacturaLineaDto {
  @IsUUID()
  servicioId: string;

  @IsUUID()
  @IsOptional()
  piezaId?: string;

  @IsString()
  @IsNotEmpty()
  descripcion: string;

  @IsNumberString()
  cantidad: string;

  @IsNumberString()
  precioUnitario: string;

  @IsNumberString()
  itbis: string;

  @IsNumberString()
  @IsOptional()
  descuento?: string;
}
