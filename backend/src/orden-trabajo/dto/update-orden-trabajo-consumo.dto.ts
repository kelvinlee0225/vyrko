import { PartialType } from '@nestjs/mapped-types';
import { CreateOrdenTrabajoConsumoDto } from './create-orden-trabajo-consumo.dto';

export class UpdateOrdenTrabajoConsumoDto extends PartialType(
  CreateOrdenTrabajoConsumoDto,
) {}
