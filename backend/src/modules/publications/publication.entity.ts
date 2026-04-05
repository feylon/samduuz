import { ApiProperty } from '@nestjs/swagger';
import { Column, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from '../../common/entities/base.entity';
import { User } from '../users/entities/user.entity';

export abstract class Publication extends BaseEntity {
  @ApiProperty({ example: 'xalqaro-ilmiy-konferensiya-2026' })
  @Column({ length: 160 })
  slug: string;

  @ApiProperty({ example: 'Xalqaro ilmiy konferensiya' })
  @Column({ length: 255 })
  titleUz: string;

  @ApiProperty({ example: 'Халқаро илмий конференция' })
  @Column({ length: 255, default: '' })
  titleKr: string;

  @ApiProperty({ example: 'Международная научная конференция' })
  @Column({ length: 255, default: '' })
  titleRu: string;

  @ApiProperty({ example: 'International scientific conference' })
  @Column({ length: 255, default: '' })
  titleEn: string;

  @ApiProperty({ example: 'Universitetda xalqaro konferensiya bo‘lib o‘tdi' })
  @Column({ length: 500, default: '' })
  descriptionUz: string;

  @ApiProperty({ example: 'Университетда халқаро конференция бўлиб ўтди' })
  @Column({ length: 500, default: '' })
  descriptionKr: string;

  @ApiProperty({ example: 'В университете прошла международная конференция' })
  @Column({ length: 500, default: '' })
  descriptionRu: string;

  @ApiProperty({ example: 'An international conference was held at the university' })
  @Column({ length: 500, default: '' })
  descriptionEn: string;

  @ApiProperty({ example: '<p>Batafsil matn...</p>' })
  @Column({ type: 'text', default: '' })
  contentUz: string;

  @ApiProperty({ example: '<p>Батафсил матн...</p>' })
  @Column({ type: 'text', default: '' })
  contentKr: string;

  @ApiProperty({ example: '<p>Подробный текст...</p>' })
  @Column({ type: 'text', default: '' })
  contentRu: string;

  @ApiProperty({ example: '<p>Full text...</p>' })
  @Column({ type: 'text', default: '' })
  contentEn: string;

  @ApiProperty({ example: 'news/2026/konferensiya.jpg' })
  @Column({ length: 500, default: '' })
  mainImagePath: string;

  @ApiProperty({ example: 312 })
  @Column({ default: 0 })
  views: number;

  @ApiProperty({ example: 14 })
  @Column({ default: 0 })
  likes: number;

  @ApiProperty({ example: true })
  @Column({ default: true })
  isPublished: boolean;

  @ApiProperty({ example: '2026-04-12T09:30:00.000Z' })
  @Column({ type: 'timestamptz', default: () => 'now()' })
  publishedAt: Date;

  @ManyToOne(() => User, { nullable: true, onDelete: 'SET NULL' })
  @JoinColumn()
  owner: User | null;

  @ApiProperty({ example: 1, nullable: true })
  @Column({ type: 'int', nullable: true })
  ownerId: number | null;
}
