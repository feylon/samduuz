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

export class CreateUsefulLinkDto {
  @ApiProperty({ example: 'Yagona interaktiv davlat xizmatlari portali' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  nameUz: string;

  @ApiPropertyOptional({ example: 'Ягона интерактив давлат хизматлари портали' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nameKr?: string;

  @ApiPropertyOptional({ example: 'Единый портал интерактивных государственных услуг' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nameRu?: string;

  @ApiPropertyOptional({ example: 'Single portal of interactive public services' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  nameEn?: string;

  @ApiProperty({ example: 'https://my.gov.uz' })
  @IsUrl({ require_protocol: true }, { message: 'externalLink to‘liq URL bo‘lishi kerak' })
  @MaxLength(500)
  externalLink: string;

  @ApiProperty({ example: 'links/mygov.png' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  imagePath: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  priority?: number;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
