import { IsNotEmpty, IsString } from 'class-validator';

export class CreateCategoriaMaterialDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
