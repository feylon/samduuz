import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PublicationsService } from '../publications/publications.service';
import { Announcement } from './entities/announcement.entity';

@Injectable()
export class AnnouncementsService extends PublicationsService<Announcement> {
  protected readonly notFoundMessage = 'E’lon topilmadi';

  constructor(@InjectRepository(Announcement) repository: Repository<Announcement>) {
    super(repository);
  }
}
