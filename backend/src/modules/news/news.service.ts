import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicationsService } from '../publications/publications.service';
import { News } from './entities/news.entity';

@Injectable()
export class NewsService extends PublicationsService<News> {
  protected readonly notFoundMessage = 'Yangilik topilmadi';

  constructor(@InjectRepository(News) repository: Repository<News>) {
    super(repository);
  }
}
