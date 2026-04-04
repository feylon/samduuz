import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsEnum, IsNotEmpty, IsOptional, IsString, MaxLength } from 'class-validator';
import { SlugFieldDto } from '../../../common/dto/slug-field';
import { PageType } from '../../../common/enums/page-type.enum';

export class CreatePageDto extends SlugFieldDto {
  @ApiProperty({ enum: PageType, example: PageType.Simple })
  @IsEnum(PageType)
  pageType: PageType;

  @ApiProperty({ example: 'Universitet tarixi' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  titleUz: string;

  @ApiPropertyOptional({ example: 'Университет тарихи' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleKr?: string;

  @ApiPropertyOptional({ example: 'История университета' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleRu?: string;

  @ApiPropertyOptional({ example: 'University history' })
  @IsOptional()
  @IsString()
  @MaxLength(255)
  titleEn?: string;

  @ApiPropertyOptional({
    example: '<p>Matn</p>',
    description: 'Oddiy sahifada HTML, rahbar va kafedra sahifalarida JSON satr',
  })
  @IsOptional()
  @IsString()
  contentUz?: string;

  @ApiPropertyOptional({ example: '<p>Матн</p>' })
  @IsOptional()
  @IsString()
  contentKr?: string;

  @ApiPropertyOptional({ example: '<p>Текст</p>' })
  @IsOptional()
  @IsString()
  contentRu?: string;

  @ApiPropertyOptional({ example: '<p>Text</p>' })
  @IsOptional()
  @IsString()
  contentEn?: string;

  @ApiPropertyOptional({ example: true, default: true })
  @IsOptional()
  @IsBoolean()
  isPublished?: boolean;
}
