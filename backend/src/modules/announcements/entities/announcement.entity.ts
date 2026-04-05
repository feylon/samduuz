import { Entity, Index } from 'typeorm';
import { Publication } from '../../publications/publication.entity';

@Entity('announcements')
@Index('UQ_announcements_slug', ['slug'], { unique: true, where: '"deleted_at" IS NULL' })
@Index('IDX_announcements_published', ['isPublished', 'publishedAt'])
export class Announcement extends Publication {}
