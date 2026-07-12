import { IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateOrdenTrabajoAsignacionDto {
  @IsUUID()
  tecnicoId: string;

  @IsString()
  @IsOptional()
  notas?: string;
}
