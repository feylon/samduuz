import { BadRequestException, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { AuthTokensDto } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly config: ConfigService,
  ) {}

  async login({ username, password }: LoginDto): Promise<AuthTokensDto> {
    const user = await this.usersService.findWithSecrets({ username });
    const passwordMatches = user && (await bcrypt.compare(password, user.passwordHash));
    if (!user || !passwordMatches) {
      throw new UnauthorizedException('Login yoki parol noto‘g‘ri');
    }
    await this.usersService.touchLogin(user.id);
    return this.issueTokens(user);
  }

  async refresh(refreshToken: string): Promise<AuthTokensDto> {
    let payload: JwtPayload;
    try {
      payload = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
      });
    } catch {
      throw new UnauthorizedException('Refresh token yaroqsiz yoki muddati tugagan');
    }

    const user = await this.usersService.findWithSecrets({ id: payload.sub });
    const tokenMatches =
      user?.refreshTokenHash && (await bcrypt.compare(refreshToken, user.refreshTokenHash));
    if (!user || !tokenMatches) {
      throw new UnauthorizedException('Refresh token yaroqsiz yoki muddati tugagan');
    }
    return this.issueTokens(user);
  }

  async logout(userId: number) {
    await this.usersService.saveRefreshToken(userId, null);
  }

  async me(userId: number) {
    const user = await this.usersService.findById(userId);
    if (!user) throw new UnauthorizedException('Foydalanuvchi topilmadi');
    return user;
  }

  async changePassword(userId: number, dto: ChangePasswordDto) {
    const user = await this.usersService.findWithSecrets({ id: userId });
    if (!user || !(await bcrypt.compare(dto.currentPassword, user.passwordHash))) {
      throw new BadRequestException('Joriy parol noto‘g‘ri kiritildi');
    }
    await this.usersService.updatePassword(userId, dto.newPassword);
  }

  private async issueTokens(user: User): Promise<AuthTokensDto> {
    const payload: JwtPayload = { sub: user.id, username: user.username, role: user.role };
    const expiresIn = this.config.get<string>('JWT_ACCESS_EXPIRES', '1h');

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_ACCESS_SECRET'),
        expiresIn: expiresIn as JwtSignOptions['expiresIn'],
      }),
      this.jwtService.signAsync(payload, {
        secret: this.config.getOrThrow('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get('JWT_REFRESH_EXPIRES', '7d') as JwtSignOptions['expiresIn'],
      }),
    ]);

    await this.usersService.saveRefreshToken(user.id, refreshToken);
    const { passwordHash: _p, refreshTokenHash: _r, ...safeUser } = user;
    return { accessToken, refreshToken, expiresIn, user: safeUser as User };
  }
}
