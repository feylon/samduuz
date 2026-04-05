import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsBoolean, IsDate, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { SlugFieldDto } from '../../../common/dto/slug-field';

export class CreatePublicationDto extends SlugFieldDto {
  @ApiProperty({ example: 'Xalqaro ilmiy konferensiya' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titleUz: string;

  @ApiPropertyOptional({ example: 'Халқаро илмий конференция' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleKr?: string;

  @ApiPropertyOptional({ example: 'Международная научная конференция' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleRu?: string;

  @ApiPropertyOptional({ example: 'International scientific conference' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleEn?: string;

  @ApiProperty({ example: 'Universitetda xalqaro konferensiya bo‘lib o‘tdi' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  descriptionUz: string;

  @ApiPropertyOptional({ example: 'Университетда халқаро конференция бўлиб ўтди' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descriptionKr?: string;

  @ApiPropertyOptional({ example: 'В университете прошла международная конференция' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descriptionRu?: string;

  @ApiPropertyOptional({ example: 'An international conference was held at the university' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descriptionEn?: string;

  @ApiPropertyOptional({ example: '<p>Batafsil matn...</p>' })
  @IsOptional()
  @IsString()
  contentUz?: string;

  @ApiPropertyOptional({ example: '<p>Батафсил матн...</p>' })
  @IsOptional()
  @IsString()
  contentKr?: string;

  @ApiPropertyOptional({ example: '<p>Подробный текст...</p>' })
  @IsOptional()
  @IsString()
  contentRu?: string;

  @ApiPropertyOptional({ example: '<p>Full text...</p>' })
  @IsOptional()
  @IsString()
  contentEn?: string;

  @ApiProperty({ example: 'news/2026/konferensiya.jpg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  mainImagePath: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;

  @ApiPropertyOptional({ example: '2026-04-12T09:30:00.000Z' })
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  publishedAt?: Date;
}
