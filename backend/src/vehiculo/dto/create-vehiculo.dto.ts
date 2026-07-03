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

  @IsUUID()
  aseguradoraId: string;

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
  año: number;

  @IsString()
  @IsNotEmpty()
  color: string;

  @IsString()
  @IsOptional()
  vinChasis?: string;
}
