import { Controller, Post, Body, Res, Get, UseGuards, Request } from '@nestjs/common';
import express from 'express';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Post('register')
    register(@Body() dto: RegisterDto) {
        return this.authService.register(dto);
    }

    @Post('login')
    async login(
        @Body() dto: LoginDto,
        @Res({ passthrough: true }) res: express.Response,
    ) {
        const { access_token } = await this.authService.login(dto);

        res.cookie('access_token', access_token, {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/',
        });
        return { message: 'Login realizado com sucesso' };
    }

    @Get('me')
    @UseGuards(AuthGuard('jwt'))
    getMe(@Request() req) {
        return {
            id: req.user.userId,
            username: req.user.username,
        };
    }

    @Post('logout')
    logout(@Res({ passthrough: true }) res: express.Response) {
        res.clearCookie('access_token', {
            httpOnly: true,
            sameSite: 'lax',
            secure: false,
            path: '/',
        });
        return { message: 'Logout realizado com sucesso' };
    }
}