import { ApiProperty } from '@nestjs/swagger';

export class LatestItemDto {
  @ApiProperty({ example: 12 })
  id: number;

  @ApiProperty({ example: 'Xalqaro ilmiy konferensiya' })
  titleUz: string;

  @ApiProperty({ example: 'xalqaro-ilmiy-konferensiya' })
  slug: string;

  @ApiProperty({ example: 312 })
  views: number;

  @ApiProperty({ example: '2026-04-12T09:30:00.000Z' })
  publishedAt: Date;
}

export class DashboardStatsDto {
  @ApiProperty({ example: 124 })
  news: number;

  @ApiProperty({ example: 38 })
  announcements: number;

  @ApiProperty({ example: 45 })
  pages: number;

  @ApiProperty({ example: 6 })
  activeSlides: number;

  @ApiProperty({ example: 8 })
  slides: number;

  @ApiProperty({ example: 27 })
  menus: number;

  @ApiProperty({ example: 9 })
  usefulLinks: number;

  @ApiProperty({ example: 892 })
  files: number;

  @ApiProperty({ example: 15342 })
  totalViews: number;

  @ApiProperty({ type: [LatestItemDto] })
  latestNews: LatestItemDto[];

  @ApiProperty({ type: [LatestItemDto] })
  popularNews: LatestItemDto[];

  @ApiProperty({ type: [LatestItemDto] })
  latestAnnouncements: LatestItemDto[];
}
