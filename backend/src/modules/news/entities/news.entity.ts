import { Entity, Index } from 'typeorm';
import { Publication } from '../../publications/publication.entity';

@Entity('news')
@Index('UQ_news_slug', ['slug'], { unique: true, where: '"deleted_at" IS NULL' })
@Index('IDX_news_published', ['isPublished', 'publishedAt'])
export class News extends Publication {}
