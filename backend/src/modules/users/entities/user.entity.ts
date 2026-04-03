import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { UserRole } from '../../../common/enums/user-role.enum';

@Entity('users')
export class User extends BaseEntity {
  @ApiProperty({ example: 'admin' })
  @Index({ unique: true })
  @Column({ length: 64 })
  username: string;

  @Column({ select: false })
  passwordHash: string;

  @ApiProperty({ example: 'Tizim administratori' })
  @Column({ length: 150 })
  fullName: string;

  @ApiProperty({ enum: UserRole, example: UserRole.Admin })
  @Column({ type: 'enum', enum: UserRole, default: UserRole.Editor })
  role: UserRole;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true, select: false })
  refreshTokenHash: string | null;

  @ApiProperty({ example: '2026-04-12T09:30:00.000Z', nullable: true })
  @Column({ type: 'timestamptz', nullable: true })
  lastLoginAt: Date | null;
}
