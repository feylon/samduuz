import { Module } from '@nestjs/common';
import { AnnouncementsModule } from '../announcements/announcements.module';
import { NewsModule } from '../news/news.module';
import { PagesModule } from '../pages/pages.module';
import { SeoController } from './seo.controller';
import { SeoService } from './seo.service';

@Module({
  imports: [NewsModule, AnnouncementsModule, PagesModule],
  controllers: [SeoController],
  providers: [SeoService],
})
export class SeoModule {}
