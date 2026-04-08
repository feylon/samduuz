import {
  Body,
  Controller,
  Delete,
  Get,
  HttpStatus,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiTags } from '@nestjs/swagger';
import { ApiDocs } from '../../common/decorators/api-docs.decorator';
import { FileItemDto, FolderListDto } from './dto/file-response.dto';
import {
  CreateFolderDto,
  PathQueryDto,
  RenameFolderDto,
  TargetPathDto,
  UploadFileDto,
} from './dto/files.dto';
import { FilesService } from './files.service';

@ApiTags('Files')
@Controller()
export class FilesController {
  constructor(private readonly filesService: FilesService) {}

  @Get('files')
  @ApiDocs({
    summary: 'Papkadagi fayllar',
    description: 'Qaytgan `url` qiymati `/uploads/` ga nisbatan yo‘l.',
    type: FileItemDto,
    isArray: true,
    auth: true,
    validation: true,
    notFound: 'Papka topilmadi',
  })
  listFiles(@Query() { path }: PathQueryDto) {
    return this.filesService.listFiles(path);
  }

  @Post('files')
  @UseInterceptors(FileInterceptor('file'))
  @ApiConsumes('multipart/form-data')
  @ApiBody({ type: UploadFileDto })
  @ApiDocs({
    summary: 'Fayl yuklash',
    description:
      'Ruxsat etilgan turlar: rasm (jpg, png, webp, gif, svg, avif), video (mp4, webm), hujjat (pdf, doc(x), xls(x), ppt(x), txt), arxiv (zip, rar). Fayl nomi slug ko‘rinishiga keltiriladi.',
    type: FileItemDto,
    status: HttpStatus.CREATED,
    message: 'Fayl yuklandi',
    auth: true,
    validation: true,
    notFound: 'Papka topilmadi',
    payloadTooLarge: true,
  })
  upload(@UploadedFile() file: Express.Multer.File, @Body() { path }: PathQueryDto) {
    return this.filesService.upload(file, path);
  }

  @Delete('files')
  @ApiDocs({
    summary: 'Faylni o‘chirish',
    message: 'Fayl o‘chirildi',
    auth: true,
    validation: true,
    notFound: 'Fayl topilmadi',
  })
  async removeFile(@Body() { path }: TargetPathDto) {
    await this.filesService.removeFile(path);
    return null;
  }

  @Get('folders')
  @ApiDocs({
    summary: 'Ichki papkalar ro‘yxati',
    type: FolderListDto,
    auth: true,
    validation: true,
    notFound: 'Papka topilmadi',
  })
  listFolders(@Query() { path }: PathQueryDto) {
    return this.filesService.listFolders(path);
  }

  @Post('folders')
  @ApiDocs({
    summary: 'Papka yaratish',
    type: FolderListDto,
    status: HttpStatus.CREATED,
    message: 'Papka yaratildi',
    auth: true,
    validation: true,
    notFound: 'Papka topilmadi',
    conflict: 'Bunday nomli papka allaqachon mavjud',
  })
  createFolder(@Body() dto: CreateFolderDto) {
    return this.filesService.createFolder(dto.path, dto.folderName);
  }

  @Put('folders')
  @ApiDocs({
    summary: 'Papka nomini o‘zgartirish',
    message: 'Papka nomi o‘zgartirildi',
    auth: true,
    validation: true,
    notFound: 'Papka topilmadi',
    conflict: 'Bunday nomli papka allaqachon mavjud',
  })
  async renameFolder(@Body() dto: RenameFolderDto) {
    await this.filesService.renameFolder(dto.path, dto.oldName, dto.newName);
    return null;
  }

  @Delete('folders')
  @ApiDocs({
    summary: 'Papkani o‘chirish',
    description: 'Papka ichidagi barcha fayllar ham o‘chiriladi.',
    message: 'Papka o‘chirildi',
    auth: true,
    validation: true,
    notFound: 'Papka topilmadi',
  })
  async removeFolder(@Body() { path }: TargetPathDto) {
    await this.filesService.removeFolder(path);
    return null;
  }
}
