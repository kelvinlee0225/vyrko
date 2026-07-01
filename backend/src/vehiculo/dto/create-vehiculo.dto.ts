import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from 'class-validator';

export class CreateVehiculoDto {
  @IsUUID()
  clienteId: string;

  @IsString()
  @IsNotEmpty()
  placa: string;

  @IsString()
  @IsNotEmpty()
  marca: string;

  @IsString()
  @IsNotEmpty()
  modelo: string;

  @IsInt()
  anio: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsOptional()
  vinChasis?: string;
}
