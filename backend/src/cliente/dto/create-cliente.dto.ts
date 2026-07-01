import {
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombreRazonSocial: string;

  @IsString()
  @IsNotEmpty()
  tipoCliente: string;

  @IsString()
  @IsOptional()
  cedulaRnc?: string;

  @IsString()
  @IsNotEmpty()
  telefono: string;

  @IsString()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  direccion?: string;

  @IsNumberString()
  @IsOptional()
  limiteCredito?: string;

  @IsInt()
  @IsOptional()
  diasCredito?: number;
}
