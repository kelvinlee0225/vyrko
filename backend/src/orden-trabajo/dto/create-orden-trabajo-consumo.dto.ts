import { IsNumberString, IsUUID } from 'class-validator';

export class CreateOrdenTrabajoConsumoDto {
  @IsUUID()
  materialId: string;

  @IsNumberString()
  cantidadReal: string;
}
