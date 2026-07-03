import { IsEmail, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateAseguradoraDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsOptional()
  rncCedula?: string;

  @IsString()
  @IsOptional()
  telefono?: string;

  @IsEmail()
  @IsOptional()
  correo?: string;

  @IsString()
  @IsOptional()
  direccion?: string;
}
