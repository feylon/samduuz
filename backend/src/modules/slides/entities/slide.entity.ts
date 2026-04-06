import { ApiProperty } from '@nestjs/swagger';
import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../../common/entities/base.entity';
import { Page } from '../../pages/entities/page.entity';
import { User } from '../../users/entities/user.entity';

@Entity('slides')
export class Slide extends BaseEntity {
  @ApiProperty({ example: 'Qabul-2026 boshlandi' })
  @Column({ length: 255 })
  titleUz: string;

  @ApiProperty({ example: 'Қабул-2026 бошланди' })
  @Column({ length: 255, default: '' })
  titleKr: string;

  @ApiProperty({ example: 'Приём-2026 начался' })
  @Column({ length: 255, default: '' })
  titleRu: string;

  @ApiProperty({ example: 'Admission 2026 has started' })
  @Column({ length: 255, default: '' })
  titleEn: string;

  @ApiProperty({ example: 'Hujjatlar qabuli 20-iyungacha davom etadi' })
  @Column({ length: 500, default: '' })
  descriptionUz: string;

  @ApiProperty({ example: 'Ҳужжатлар қабули 20-июнгача давом этади' })
  @Column({ length: 500, default: '' })
  descriptionKr: string;

  @ApiProperty({ example: 'Приём документов продлится до 20 июня' })
  @Column({ length: 500, default: '' })
  descriptionRu: string;

  @ApiProperty({ example: 'Applications are accepted until June 20' })
  @Column({ length: 500, default: '' })
  descriptionEn: string;

  @ApiProperty({ example: 'slides/qabul-2026.jpg' })
  @Column({ length: 500 })
  mainImagePath: string;

  @ApiProperty({ example: 'https://qabul.samdu.uz', nullable: true })
  @Column({ type: 'varchar', length: 500, nullable: true })
  externalLink: string | null;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isActive: boolean;

  @ApiProperty({ example: 1 })
  @Column({ default: 1 })
  priority: number;

  @ApiProperty({ type: () => Page, nullable: true })
  @ManyToOne(() => Page, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  relatedPage: Page | null;

  @ApiProperty({ example: 3, nullable: true })
  @Column({ type: 'int', nullable: true })
  relatedPageId: number | null;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  owner: User | null;

  @ApiProperty({ example: 1, nullable: true })
  @Column({ type: 'int', nullable: true })
  ownerId: number | null;
}
