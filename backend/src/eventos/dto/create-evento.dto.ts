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

  @IsDateString({}, { message: 'Data início deve ser uma data válida' })
  dataInicio: string;

  @IsDateString({}, { message: 'Data fim deve ser uma data válida' })
  @Validate(IsAfterConstraint, ['dataInicio'])
  dataFim: string;

  @IsString({ message: 'Descrição deve ser um texto' })
  @IsOptional()
  descricao?: string;

  @IsString({ message: 'Cor deve ser um texto' })
  @IsNotEmpty({ message: 'Cor é obrigatória' })
  @IsHexColor({})
  cor: string;
}