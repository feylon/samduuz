import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import { IsNotEmpty, IsOptional, IsString, Matches, MaxLength } from 'class-validator';

const trim = ({ value }: { value: unknown }) => (typeof value === 'string' ? value.trim() : value);
const FOLDER_PATTERN = /^[a-zA-Z0-9][a-zA-Z0-9_-]{0,63}$/;
const FOLDER_MESSAGE =
  'Papka nomi lotin harflari, raqamlar, "-" va "_" belgilaridan iborat bo‘lishi kerak';

export class PathQueryDto {
  @ApiPropertyOptional({ example: 'news/2026', default: '/' })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  @Transform(trim)
  path?: string;
}

export class UploadFileDto extends PathQueryDto {
  @ApiProperty({ type: 'string', format: 'binary' })
  file: unknown;
}

export class TargetPathDto {
  @ApiProperty({ example: 'news/2026/konferensiya.jpg' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(500)
  @Transform(trim)
  path: string;
}

export class CreateFolderDto extends PathQueryDto {
  @ApiProperty({ example: 'news' })
  @Transform(trim)
  @Matches(FOLDER_PATTERN, { message: FOLDER_MESSAGE })
  folderName: string;
}

export class RenameFolderDto extends PathQueryDto {
  @ApiProperty({ example: 'yangiliklar' })
  @IsString()
  @IsNotEmpty()
  @Transform(trim)
  oldName: string;

  @ApiProperty({ example: 'news' })
  @Transform(trim)
  @Matches(FOLDER_PATTERN, { message: FOLDER_MESSAGE })
  newName: string;
}
