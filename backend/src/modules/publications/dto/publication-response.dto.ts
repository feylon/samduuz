import { ApiProperty } from '@nestjs/swagger';

export class PublicationListItemDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'xalqaro-ilmiy-konferensiya-2026' })
  slug: string;

  @ApiProperty({ example: 'Xalqaro ilmiy konferensiya' })
  title: string;

  @ApiProperty({ example: 'Universitetda xalqaro konferensiya bo‘lib o‘tdi' })
  description: string;

  @ApiProperty({ example: 'news/2026/konferensiya.jpg' })
  mainImagePath: string;

  @ApiProperty({ example: 312 })
  views: number;

  @ApiProperty({ example: 14 })
  likes: number;

  @ApiProperty({ example: '2026-04-12T09:30:00.000Z' })
  publishedAt: Date;

  @ApiProperty({ example: '2026-04-12T09:30:00.000Z' })
  updatedAt: Date;
}

export class PublicationDetailDto extends PublicationListItemDto {
  @ApiProperty({ example: '<p>Batafsil matn...</p>' })
  content: string;

  @ApiProperty({ type: [PublicationListItemDto] })
  related: PublicationListItemDto[];
}

export class LikeResultDto {
  @ApiProperty({ example: 15 })
  likes: number;
}
