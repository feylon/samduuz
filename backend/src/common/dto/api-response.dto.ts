import { ApiProperty } from '@nestjs/swagger';

export class FieldErrorDto {
  @ApiProperty({ example: 'titleUz' })
  field: string;

  @ApiProperty({ example: 'titleUz bo‘sh bo‘lmasligi kerak' })
  message: string;
}

export class PaginationMetaDto {
  @ApiProperty({ example: 42 })
  totalCount: number;

  @ApiProperty({ example: 1 })
  page: number;

  @ApiProperty({ example: 5 })
  totalPages: number;

  @ApiProperty({ example: 10 })
  pageSize: number;
}

export class ErrorResponseDto {
  @ApiProperty({ example: false })
  success: boolean;

  @ApiProperty({ example: 400 })
  statusCode: number;

  @ApiProperty({ example: 'Validatsiya xatoligi' })
  message: string;

  @ApiProperty({ example: null, nullable: true, type: Object })
  data: null;

  @ApiProperty({ type: [FieldErrorDto] })
  errors: FieldErrorDto[];

  @ApiProperty({ example: '/api/news' })
  path: string;

  @ApiProperty({ example: '2026-04-12T09:30:00.000Z' })
  timestamp: string;
}
