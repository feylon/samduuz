import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsOptional } from 'class-validator';
import { PaginationQueryDto } from '../../../common/dto/pagination-query.dto';
import { PageType } from '../../../common/enums/page-type.enum';

export class PageQueryDto extends PaginationQueryDto {
  @ApiPropertyOptional({ enum: PageType })
  @IsOptional()
  @Type(() => Number)
  @IsEnum(PageType)
  pageType?: PageType;
}
