import { ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsOptional, IsString, Matches, MaxLength } from 'class-validator';

export class SlugFieldDto {
  @ApiPropertyOptional({
    example: 'universitet-tarixi',
    description: 'Bo‘sh qoldirilsa o‘zbekcha sarlavhadan avtomatik yaratiladi',
  })
  @IsOptional()
  @Transform(({ value }) =>
    typeof value === 'string' ? value.trim().toLowerCase() || undefined : value,
  )
  @IsString()
  @MaxLength(160)
  @Matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message: 'slug faqat lotin harflari, raqamlar va chiziqchadan iborat bo‘lishi kerak',
  })
  slug?: string;
}
