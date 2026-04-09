import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../announcements/entities/announcement.entity';
import { FilesService } from '../files/files.service';
import { Menu } from '../menus/entities/menu.entity';
import { News } from '../news/entities/news.entity';
import { Page } from '../pages/entities/page.entity';
import { Publication } from '../publications/publication.entity';
import { Slide } from '../slides/entities/slide.entity';
import { UsefulLink } from '../useful-links/entities/useful-link.entity';
import { DashboardStatsDto } from './stats.dto';

const shortSelect = { id: true, titleUz: true, slug: true, views: true, publishedAt: true };

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(News) private readonly news: Repository<News>,
    @InjectRepository(Announcement) private readonly announcements: Repository<Announcement>,
    @InjectRepository(Page) private readonly pages: Repository<Page>,
    @InjectRepository(Slide) private readonly slides: Repository<Slide>,
    @InjectRepository(Menu) private readonly menus: Repository<Menu>,
    @InjectRepository(UsefulLink) private readonly usefulLinks: Repository<UsefulLink>,
    private readonly filesService: FilesService,
  ) {}

  async dashboard(): Promise<DashboardStatsDto> {
    const [
      news,
      announcements,
      pages,
      slides,
      activeSlides,
      menus,
      usefulLinks,
      files,
      newsViews,
      announcementViews,
      pageViews,
      latestNews,
      popularNews,
      latestAnnouncements,
    ] = await Promise.all([
      this.news.count(),
      this.announcements.count(),
      this.pages.count(),
      this.slides.count(),
      this.slides.count({ where: { isActive: true } }),
      this.menus.count(),
      this.usefulLinks.count(),
      this.filesService.countFiles(),
      this.news.sum('views'),
      this.announcements.sum('views'),
      this.pages.sum('views'),
      this.news.find({ select: shortSelect, order: { publishedAt: 'DESC' }, take: 5 }),
      this.news.find({ select: shortSelect, order: { views: 'DESC' }, take: 5 }),
      this.announcements.find({ select: shortSelect, order: { publishedAt: 'DESC' }, take: 5 }),
    ]);

    return {
      news,
      announcements,
      pages,
      slides,
      activeSlides,
      menus,
      usefulLinks,
      files,
      totalViews: (newsViews ?? 0) + (announcementViews ?? 0) + (pageViews ?? 0),
      latestNews: latestNews as Publication[],
      popularNews: popularNews as Publication[],
      latestAnnouncements: latestAnnouncements as Publication[],
    };
  }
}
