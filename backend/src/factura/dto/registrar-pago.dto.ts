import {
  IsDateString,
  IsNumberString,
  IsOptional,
  IsString,
} from 'class-validator';

export class RegistrarPagoDto {
  @IsNumberString()
  monto: string;

  @IsString()
  @IsOptional()
  metodoPago?: string;

  @IsDateString()
  @IsOptional()
  fechaPago?: string;
}
