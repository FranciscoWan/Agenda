import {
  IsString,
  IsNotEmpty,
  IsOptional,
  IsHexColor,
  Validate,
  MinLength,
  IsDateString,
} from 'class-validator';
import { IsAfterConstraint } from '../validators/is-after.validator';

export class CreateEventDto {

  
  @IsString({ message: 'Título deve ser um texto' })
  @MinLength(1, { message: 'Título não pode estar vazio' })
  titulo: string;
  
  @IsDateString()
  dataInicio: string;
  
  @IsDateString()
  @Validate(IsAfterConstraint, ['dataInicio'])
  dataFim: string;
  
  @IsString()
  @IsOptional()
  descricao?: string;

  @IsString()
  @IsNotEmpty()
  @IsHexColor()
  cor: string;
}
