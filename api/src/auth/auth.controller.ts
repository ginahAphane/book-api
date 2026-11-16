import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { JwtAuthGuard } from './jwt-auth.guard';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}
  @Post('register') register(@Body() dto: RegisterDto) { return this.authService.register(dto); }
  @Throttle({ default: { limit: 5, ttl: 60000 } })
  @Post('login') login(@Body() dto: LoginDto) { return this.authService.login(dto); }
}

@Controller('users')
export class UsersController {
  @UseGuards(JwtAuthGuard)
  @Get('profile') getProfile(@Req() req: any) { return req.user; }
}