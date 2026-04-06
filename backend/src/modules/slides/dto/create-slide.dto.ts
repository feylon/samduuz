import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateSlideDto {
  @ApiProperty({ example: 'Qabul-2026 boshlandi' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titleUz: string;

  @ApiPropertyOptional({ example: 'Қабул-2026 бошланди' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleKr?: string;

  @ApiPropertyOptional({ example: 'Приём-2026 начался' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleRu?: string;

  @ApiPropertyOptional({ example: 'Admission 2026 has started' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleEn?: string;

  @ApiPropertyOptional({ example: 'Hujjatlar qabuli 20-iyungacha davom etadi' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descriptionUz?: string;

  @ApiPropertyOptional({ example: 'Ҳужжатлар қабули 20-июнгача давом этади' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descriptionKr?: string;

  @ApiPropertyOptional({ example: 'Приём документов продлится до 20 июня' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descriptionRu?: string;

  @ApiPropertyOptional({ example: 'Applications are accepted until June 20' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  descriptionEn?: string;

  @ApiProperty({ example: 'slides/qabul-2026.jpg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  mainImagePath: string;

  @ApiPropertyOptional({ example: 'https://qabul.samdu.uz', nullable: true })
  @IsOptional()
  @IsUrl({ require_protocol: true }, { message: 'externalLink to‘liq URL bo‘lishi kerak' })
  @MaxLength(500)
  externalLink?: string | null;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  priority?: number;

  @ApiPropertyOptional({ example: 3, nullable: true })
  @IsOptional()
  @IsInt()
  relatedPageId?: number | null;
}
