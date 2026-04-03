import { Body, Controller, Get, HttpStatus, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ApiDocs } from '../../common/decorators/api-docs.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { User } from '../users/entities/user.entity';
import { AuthService } from './auth.service';
import { AuthTokensDto } from './dto/auth-response.dto';
import { ChangePasswordDto } from './dto/change-password.dto';
import { LoginDto } from './dto/login.dto';
import { RefreshTokenDto } from './dto/refresh-token.dto';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @Throttle({ default: { limit: 10, ttl: 60_000 } })
  @ApiDocs({
    summary: 'Tizimga kirish',
    description: 'Login va parol orqali access hamda refresh token olish.',
    type: AuthTokensDto,
    message: 'Tizimga muvaffaqiyatli kirildi',
    validation: true,
    unauthorized: 'Login yoki parol noto‘g‘ri',
  })
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto);
  }

  @Post('refresh')
  @ApiDocs({
    summary: 'Tokenni yangilash',
    type: AuthTokensDto,
    message: 'Token yangilandi',
    validation: true,
    unauthorized: 'Refresh token yaroqsiz yoki muddati tugagan',
  })
  refresh(@Body() dto: RefreshTokenDto) {
    return this.authService.refresh(dto.refreshToken);
  }

  @Get('me')
  @ApiDocs({ summary: 'Joriy foydalanuvchi ma’lumotlari', type: User, auth: true })
  me(@CurrentUser('sub') userId: number) {
    return this.authService.me(userId);
  }

  @Post('logout')
  @ApiDocs({
    summary: 'Tizimdan chiqish',
    description: 'Refresh token bekor qilinadi.',
    status: HttpStatus.OK,
    message: 'Tizimdan chiqildi',
    auth: true,
  })
  async logout(@CurrentUser('sub') userId: number) {
    await this.authService.logout(userId);
    return null;
  }

  @Put('password')
  @ApiDocs({
    summary: 'Parolni o‘zgartirish',
    message: 'Parol muvaffaqiyatli o‘zgartirildi',
    auth: true,
    validation: true,
  })
  async changePassword(@CurrentUser('sub') userId: number, @Body() dto: ChangePasswordDto) {
    await this.authService.changePassword(userId, dto);
    return null;
  }
}
