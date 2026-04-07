import { ApiProperty } from '@nestjs/swagger';

export class PublicUsefulLinkDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Yagona interaktiv davlat xizmatlari portali' })
  name: string;

  @ApiProperty({ example: 'https://my.gov.uz' })
  externalLink: string;

  @ApiProperty({ example: 'links/mygov.png' })
  imagePath: string;
}
