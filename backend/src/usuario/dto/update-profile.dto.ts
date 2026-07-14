import {
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
} from 'class-validator';

export class UpdateProfileDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  nombre?: string;

  @IsString()
  @MinLength(3)
  @IsOptional()
  username?: string;

  @IsString()
  @MinLength(8)
  @IsOptional()
  password?: string;

  @ValidateIf((o: UpdateProfileDto) => !!o.password)
  @IsString()
  @IsNotEmpty()
  currentPassword?: string;
}
