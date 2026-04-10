import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcryptjs';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly users: Repository<User>) {}

  findById(id: number) {
    return this.users.findOne({ where: { id, isActive: true } });
  }

  findWithSecrets(where: { id?: number; username?: string }) {
    return this.users
      .createQueryBuilder('user')
      .addSelect(['user.passwordHash', 'user.refreshTokenHash'])
      .where(where.id ? 'user.id = :id' : 'LOWER(user.username) = LOWER(:username)', where)
      .andWhere('user.isActive = true')
      .getOne();
  }

  async saveRefreshToken(userId: number, token: string | null) {
    const refreshTokenHash = token ? await bcrypt.hash(token, 10) : null;
    await this.users.update(userId, { refreshTokenHash });
  }

  async touchLogin(userId: number) {
    await this.users.update(userId, { lastLoginAt: new Date() });
  }

  async updatePassword(userId: number, password: string) {
    await this.users.update(userId, {
      passwordHash: await bcrypt.hash(password, 10),
      refreshTokenHash: null,
    });
  }
}
