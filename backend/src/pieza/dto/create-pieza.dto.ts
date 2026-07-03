import { IsNotEmpty, IsString } from 'class-validator';

export class CreatePiezaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;
}
