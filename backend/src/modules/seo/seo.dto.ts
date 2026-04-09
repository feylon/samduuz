import { ApiProperty } from '@nestjs/swagger';

export class SitemapEntryDto {
  @ApiProperty({ example: 'xalqaro-ilmiy-konferensiya' })
  slug: string;

  @ApiProperty({ example: '2026-04-12T09:30:00.000Z' })
  updatedAt: Date;
}

export class SitemapDto {
  @ApiProperty({ type: [SitemapEntryDto] })
  pages: SitemapEntryDto[];

  @ApiProperty({ type: [SitemapEntryDto] })
  news: SitemapEntryDto[];

  @ApiProperty({ type: [SitemapEntryDto] })
  announcements: SitemapEntryDto[];
}
