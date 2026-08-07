import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';
import { TipoIdentificacion } from '../enums/tipo-identificacion.enum';

export class CreateClienteDto {
  @IsString()
  @IsNotEmpty()
  nombreRazonSocial: string;

  @IsString()
  @IsNotEmpty()
  tipoCliente: string;

  @IsBoolean()
  @IsOptional()
  esAseguradora?: boolean;

  @IsString()
  @IsOptional()
  numeroIdentificacion?: string;

  @IsEnum(TipoIdentificacion)
  @IsOptional()
  tipoIdentificacion?: TipoIdentificacion;

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
