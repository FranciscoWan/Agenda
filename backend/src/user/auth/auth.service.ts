import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UserService } from '../user.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

async register(dto: RegisterDto) {
  const hashedPassword = await bcrypt.hash(dto.password, 10);
  console.log(process.env.JWT_SECRET);
  const user = await this.usersService.create({
    username: dto.username,
    password: hashedPassword,
  });

  return {
    id: user.id,
    username: user.username,
  };
}

async login(dto: LoginDto) {
    const user = await this.usersService.findByUsername(dto.username);

    if (!user) {
      throw new UnauthorizedException('Login inválido');
    }

    const isPasswordValid = await bcrypt.compare(dto.password, user.password);

    if (!isPasswordValid) {
      throw new UnauthorizedException('Senha incorreta');
    }

    const payload = { sub: user.id, username: user.username };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
