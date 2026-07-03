import { PartialType } from '@nestjs/mapped-types';
import { CreateCotizacionLineaDto } from './create-cotizacion-linea.dto';

export class UpdateCotizacionLineaDto extends PartialType(
  CreateCotizacionLineaDto,
) {}
