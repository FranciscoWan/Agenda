import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  
  @IsString({ message: 'Username deve ser um texto' })
  @MinLength(3, { message: 'Username deve ter no mínimo 3 caracteres' })
  @MaxLength(20, { message: 'Username deve ter no máximo 20 caracteres' })
  username: string;

  @IsString({ message: 'Senha deve ser um texto' })
  @MinLength(6, { message: 'Senha deve ter no mínimo 6 caracteres' })
  @MaxLength(20, { message: 'Senha deve ter no máximo 20 caracteres' })
  password: string;

  @IsString({ message: 'Telefone deve ser um texto' })
  @MinLength(10, { message: 'Telefone deve ter no mínimo 10 caracteres' })
  @MaxLength(20, { message: 'Telefone deve ter no máximo 20 caracteres' })
  @Matches(/^[0-9()+\-.\s]+$/, {
    message: 'Telefone deve conter apenas números e caracteres válidos',
  })
  telefone: string;
}