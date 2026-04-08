import { ApiProperty } from '@nestjs/swagger';

export class FileItemDto {
  @ApiProperty({ example: 'konferensiya.jpg' })
  name: string;

  @ApiProperty({ example: 'news/2026/konferensiya.jpg' })
  url: string;

  @ApiProperty({ example: 245760 })
  size: number;

  @ApiProperty({ example: 'image', enum: ['image', 'video', 'document', 'archive', 'other'] })
  kind: string;

  @ApiProperty({ example: '2026-04-12T09:30:00.000Z' })
  modifiedAt: Date;
}

export class FolderListDto {
  @ApiProperty({ example: ['news', 'slides', 'pages'] })
  folders: string[];
}
