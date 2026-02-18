import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsDate,
  Length,
  IsHexColor,
  Validate,
} from 'class-validator';
import { Type } from 'class-transformer';
import { IsBeforeConstraint } from '../validators/is-before.validator';

export class CreateEventDto {
  @IsString()
  @IsNotEmpty()
  @Length(1, 150)
  titulo: string;

  @IsString()
  @IsOptional()
  descricao?: string;

  @Type(() => Date)
  @IsDate()
  dataInicio: Date;

  @Type(() => Date)
  @IsDate()
  @Validate(IsBeforeConstraint, ['dataInicio'])
  dataFim: Date;

  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  cor: string;
}
