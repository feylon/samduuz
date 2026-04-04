import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, Index, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { PageType } from '../../../common/enums/page-type.enum';
import { User } from '../../users/entities/user.entity';

@Entity('pages')
@Index('UQ_pages_slug', ['slug'], { unique: true, where: '"deleted_at" IS NULL' })
export class Page extends BaseEntity {
  @ApiProperty({
    enum: PageType,
    example: PageType.Simple,
    description: '0 - oddiy, 1 - rahbar, 2 - kafedra',
  })
  @Column({ type: 'smallint', default: PageType.Simple })
  pageType: PageType;

  @ApiProperty({ example: 'universitet-tarixi' })
  @Column({ length: 160 })
  slug: string;

  @ApiProperty({ example: 'Universitet tarixi' })
  @Column({ length: 255 })
  titleUz: string;

  @ApiProperty({ example: 'Университет тарихи' })
  @Column({ length: 255, default: '' })
  titleKr: string;

  @ApiProperty({ example: 'История университета' })
  @Column({ length: 255, default: '' })
  titleRu: string;

  @ApiProperty({ example: 'University history' })
  @Column({ length: 255, default: '' })
  titleEn: string;

  @ApiProperty({ example: '<p>Universitet 1927-yilda tashkil etilgan...</p>' })
  @Column({ type: 'text', default: '' })
  contentUz: string;

  @ApiProperty({ example: '<p>Университет 1927 йилда ташкил этилган...</p>' })
  @Column({ type: 'text', default: '' })
  contentKr: string;

  @ApiProperty({ example: '<p>Университет основан в 1927 году...</p>' })
  @Column({ type: 'text', default: '' })
  contentRu: string;

  @ApiProperty({ example: '<p>The university was founded in 1927...</p>' })
  @Column({ type: 'text', default: '' })
  contentEn: string;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isPublished: boolean;

  @ApiProperty({ example: 128 })
  @Column({ default: 0 })
  views: number;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  owner: User | null;

  @ApiProperty({ example: 1, nullable: true })
  @Column({ type: 'int', nullable: true })
  ownerId: number | null;
}
