import { ApiProperty } from '@nestjs/swagger';
import { IsString, MaxLength, MinLength } from 'class-validator';

export class ChangePasswordDto {
  @ApiProperty({ example: 'Admin12345' })
  @IsString()
  @MinLength(6)
  currentPassword: string;

  @ApiProperty({ example: 'YangiParol2026' })
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  newPassword: string;
}
