import {
  IsBoolean,
  IsEnum,
  IsInt,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
  Matches,
  ValidateIf,
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

  // DGII's RNCValidationType (9 or 11 numeric digits) covers both RNC and
  // cedula on the buyer side — only enforced when the client actually
  // carries one, since walk-in consumers use TipoIdentificacion.NINGUNA.
  @ValidateIf(
    (o) =>
      o.tipoIdentificacion === TipoIdentificacion.RNC ||
      o.tipoIdentificacion === TipoIdentificacion.CEDULA,
  )
  @IsString()
  @Matches(/^([0-9]{9}|[0-9]{11})$/, {
    message: 'numeroIdentificacion debe tener 9 u 11 digitos numericos (formato DGII)',
  })
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
