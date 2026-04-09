import { Module } from '@nestjs/common';
import { AnnouncementsModule } from '../announcements/announcements.module';
import { FilesModule } from '../files/files.module';
import { MenusModule } from '../menus/menus.module';
import { NewsModule } from '../news/news.module';
import { PagesModule } from '../pages/pages.module';
import { SlidesModule } from '../slides/slides.module';
import { UsefulLinksModule } from '../useful-links/useful-links.module';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [
    NewsModule,
    AnnouncementsModule,
    PagesModule,
    SlidesModule,
    MenusModule,
    UsefulLinksModule,
    FilesModule,
  ],
  controllers: [StatsController],
  providers: [StatsService],
})
export class StatsModule {}
