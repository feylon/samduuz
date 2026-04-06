import { ApiProperty } from '@nestjs/swagger';

export class PublicSlideDto {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 'Qabul-2026 boshlandi' })
  title: string;

  @ApiProperty({ example: 'Hujjatlar qabuli 20-iyungacha davom etadi' })
  description: string;

  @ApiProperty({ example: 'slides/qabul-2026.jpg' })
  mainImagePath: string;

  @ApiProperty({ example: '/pages/qabul-2026', nullable: true })
  link: string | null;

  @ApiProperty({ example: false })
  isExternal: boolean;
}
