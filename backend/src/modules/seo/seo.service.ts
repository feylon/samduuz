import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Announcement } from '../announcements/entities/announcement.entity';
import { News } from '../news/entities/news.entity';
import { Page } from '../pages/entities/page.entity';
import { SitemapDto } from './seo.dto';

@Injectable()
export class SeoService {
  constructor(
    @InjectRepository(News) private readonly news: Repository<News>,
    @InjectRepository(Announcement) private readonly announcements: Repository<Announcement>,
    @InjectRepository(Page) private readonly pages: Repository<Page>,
  ) {}

  async sitemap(): Promise<SitemapDto> {
    const select = { slug: true, updatedAt: true };
    const visible = { isPublished: true, publishedAt: LessThanOrEqual(new Date()) };

    const [pages, news, announcements] = await Promise.all([
      this.pages.find({ select, where: { isPublished: true }, order: { updatedAt: 'DESC' } }),
      this.news.find({ select, where: visible, order: { publishedAt: 'DESC' }, take: 5000 }),
      this.announcements.find({
        select,
        where: visible,
        order: { publishedAt: 'DESC' },
        take: 5000,
      }),
    ]);

    return { pages, news, announcements };
  }
}
