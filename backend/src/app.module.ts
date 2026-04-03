import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { envValidationSchema } from './config/env.validation';
import { buildDataSourceOptions } from './database/typeorm.config';
import { AuthModule } from './modules/auth/auth.module';
import { HealthModule } from './modules/health/health.module';
import { UsersModule } from './modules/users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, validationSchema: envValidationSchema }),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: () => ({
        ...buildDataSourceOptions(process.env),
        migrationsRun: true,
        autoLoadEntities: true,
      }),
    }),
    ThrottlerModule.forRoot([{ ttl: 60_000, limit: 300 }]),
    ServeStaticModule.forRoot({
      rootPath: resolve(process.env.UPLOAD_DIR ?? 'uploads'),
      serveRoot: '/uploads',
      serveStaticOptions: { index: false, maxAge: '7d' },
    }),
    HealthModule,
    UsersModule,
    AuthModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
