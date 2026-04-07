import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

export class CreateMenuDto {
  @ApiProperty({ example: 'Universitet' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  nameUz: string;

  @ApiPropertyOptional({ example: 'Университет' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nameKr?: string;

  @ApiPropertyOptional({ example: 'Университет' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nameRu?: string;

  @ApiPropertyOptional({ example: 'University' })
  @IsOptional()
  @IsString()
  @MaxLength(150)
  nameEn?: string;

  @ApiPropertyOptional({ example: 1, default: 1 })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(1000)
  priority?: number;

  @ApiPropertyOptional({ example: null, nullable: true, type: Number })
  @IsOptional()
  @IsInt()
  parentId?: number | null;

  @ApiPropertyOptional({ example: 3, nullable: true, type: Number })
  @IsOptional()
  @IsInt()
  relatedPageId?: number | null;

  @ApiPropertyOptional({
    example: 'https://hemis.samdu.uz',
    nullable: true,
    description: 'To‘liq URL yoki saytdagi yo‘l (masalan /news)',
  })
  @IsOptional()
  @Transform(({ value }) => (typeof value === 'string' ? value.trim() || null : value))
  @IsString()
  @MaxLength(500)
  @Matches(/^(https?:\/\/|\/)/, {
    message: 'externalLink http(s):// yoki / bilan boshlanishi kerak',
  })
  externalLink?: string | null;
}
