import {
  IsEmail,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
} from 'class-validator';
import {
  CODIGOS_MUNICIPIO,
  CODIGOS_PROVINCIA,
} from '../../common/catalogos/provincia-municipio.catalogo';

export class UpsertEmpresaDto {
  @IsString()
  @IsNotEmpty()
  nombre: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^([0-9]{9}|[0-9]{11})$/, {
    message: 'rnc debe tener 9 u 11 digitos numericos (formato DGII)',
  })
  rnc: string;

  @IsString()
  @IsNotEmpty()
  direccion: string;

  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{3}-\d{3}-\d{4}$/, {
    message: 'telefono debe tener el formato DGII: 000-000-0000',
  })
  telefono: string;

  @IsEmail()
  correo: string;

  @IsString()
  @IsOptional()
  nombreComercial?: string;

  /** DGII municipio code (ProvinciaMunicipioType), e.g. "320200" = Santo Domingo Oeste. */
  @IsIn(CODIGOS_MUNICIPIO)
  @IsOptional()
  municipio?: string;

  /** DGII provincia code (ProvinciaMunicipioType), e.g. "320000" = Santo Domingo. */
  @IsIn(CODIGOS_PROVINCIA)
  @IsOptional()
  provincia?: string;

  @IsString()
  @IsOptional()
  actividadEconomica?: string;
}
