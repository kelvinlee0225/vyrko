import {
  IsBoolean,
  IsNotEmpty,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateServicioDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  tipoTrabajo: string;

  @IsNumberString()
  precioBase: string;

  @IsBoolean()
  @IsOptional()
  llevaItbis?: boolean;
}
