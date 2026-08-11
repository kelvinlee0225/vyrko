import { IsDateString, IsEnum, IsInt, Min, ValidateIf } from 'class-validator';
import { TipoECF } from '../../factura/enums/tipo-ecf.enum';

export class CreateSecuenciaNcfDto {
  @IsEnum(TipoECF)
  tipoECF: TipoECF;

  @IsInt()
  @Min(1)
  desde: number;

  @IsInt()
  @Min(1)
  hasta: number;

  /**
   * DGII requires FechaVencimientoSecuencia in every e-CF tipo 31 document
   * (XSD minOccurs=1), so a tipo-31 range is meaningless without one.
   * Tipo 32 ranges are commonly authorized with no expiration at all.
   */
  @ValidateIf(
    (dto: CreateSecuenciaNcfDto) => dto.tipoECF === TipoECF.CREDITO_FISCAL,
  )
  @IsDateString()
  fechaVencimiento?: string;
}
