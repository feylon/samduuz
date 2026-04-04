import { ApiProperty } from '@nestjs/swagger';
import { PageType } from '../../../common/enums/page-type.enum';

export class PublicPageDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'universitet-tarixi' })
  slug: string;

  @ApiProperty({ enum: PageType, example: PageType.Simple })
  pageType: PageType;

  @ApiProperty({ example: 'Universitet tarixi' })
  title: string;

  @ApiProperty({ example: '<p>Universitet 1927-yilda tashkil etilgan...</p>' })
  content: string;

  @ApiProperty({ example: 'Universitet 1927-yilda tashkil etilgan...' })
  excerpt: string;

  @ApiProperty({ example: 128 })
  views: number;

  @ApiProperty({ example: '2026-04-12T09:30:00.000Z' })
  createdAt: Date;

  @ApiProperty({ example: '2026-04-12T09:30:00.000Z' })
  updatedAt: Date;
}

export class PageOptionDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Universitet tarixi' })
  titleUz: string;

  @ApiProperty({ example: 'universitet-tarixi' })
  slug: string;

  @ApiProperty({ enum: PageType, example: PageType.Simple })
  pageType: PageType;
}
