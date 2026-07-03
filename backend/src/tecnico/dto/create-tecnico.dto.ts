import { IsBoolean, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateTecnicoDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  especialidad: string;

  @IsBoolean()
  @IsOptional()
  activo?: boolean;
}
