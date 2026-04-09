import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { TypeOrmModule } from '@nestjs/typeorm';
import { resolve } from 'path';
import { envValidationSchema } from './config/env.validation';
import { buildDataSourceOptions } from './database/typeorm.config';
import { AnnouncementsModule } from './modules/announcements/announcements.module';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { HealthModule } from './modules/health/health.module';
import { MenusModule } from './modules/menus/menus.module';
import { NewsModule } from './modules/news/news.module';
import { PagesModule } from './modules/pages/pages.module';
import { SeoModule } from './modules/seo/seo.module';
import { SlidesModule } from './modules/slides/slides.module';
import { StatsModule } from './modules/stats/stats.module';
import { UsefulLinksModule } from './modules/useful-links/useful-links.module';
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
    PagesModule,
    NewsModule,
    AnnouncementsModule,
    SlidesModule,
    MenusModule,
    UsefulLinksModule,
    FilesModule,
    StatsModule,
    SeoModule,
  ],
  providers: [{ provide: APP_GUARD, useClass: ThrottlerGuard }],
})
export class AppModule {}
