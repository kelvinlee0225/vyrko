import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateMaterialDto {
  @IsUUID()
  categoriaId: string;

  @IsString()
  @IsNotEmpty()
  codigo: string;

  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsNumberString()
  precioCosto: string;

  @IsNumberString()
  @IsOptional()
  stockActual?: string;

  @IsInt()
  @IsOptional()
  stockMinimo?: number;
}
