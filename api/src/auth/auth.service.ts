import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async register(dto: RegisterDto) {
    const exists = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (exists) throw new ConflictException('Email already registered');
    const hashed = await bcrypt.hash(dto.password, 10);
    const user = await this.prisma.user.create({ data: { name: dto.name, email: dto.email, password: hashed, role: dto.role ?? 'USER' } });
    const { password, ...safeUser } = user;
    return { user: safeUser, access_token: this.signToken(user.id, user.email, user.role) };
  }

  async login(dto: LoginDto) {
    const user = await this.prisma.user.findUnique({ where: { email: dto.email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');
    const isValid = await bcrypt.compare(dto.password, user.password);
    if (!isValid) throw new UnauthorizedException('Invalid credentials');
    const { password, ...safeUser } = user;
    return { user: safeUser, access_token: this.signToken(user.id, user.email, user.role) };
  }

  private signToken(id: number, email: string, role: string) {
    return this.jwt.sign({ sub: id, email, role });
  }
}