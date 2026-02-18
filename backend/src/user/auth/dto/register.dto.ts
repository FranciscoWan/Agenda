import { IsString, MinLength, MaxLength, Matches } from 'class-validator';

export class RegisterDto {
  
  @IsString()
  @MinLength(3)
  @MaxLength(20)
  username: string;

  @IsString()
  @MinLength(6)
  @MaxLength(20)
  password: string;

  @IsString()
  @MinLength(10)
  @MaxLength(20)
  @Matches(/^[0-9()+\-.\s]+$/, {
    message: 'Telefone deve conter apenas números e caracteres válidos',
  })
  telefone: string;
}
