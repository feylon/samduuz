import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { Throttle } from '@nestjs/throttler';
import { ApiDocs } from '../../common/decorators/api-docs.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IdParam } from '../../common/decorators/id-param.decorator';
import { Lang } from '../../common/decorators/lang.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Language } from '../../common/enums/language.enum';
import { CreatePublicationDto } from '../publications/dto/create-publication.dto';
import {
  LikeResultDto,
  PublicationDetailDto,
  PublicationListItemDto,
} from '../publications/dto/publication-response.dto';
import { UpdatePublicationDto } from '../publications/dto/update-publication.dto';
import { Announcement } from './entities/announcement.entity';
import { AnnouncementsService } from './announcements.service';

const NOT_FOUND = 'E’lon topilmadi';

@ApiTags('Announcements')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @ApiDocs({
    summary: 'E’lonlar ro‘yxati (ommaviy)',
    description: 'Faqat chop etilgan yozuvlar, tanlangan tilga tarjima qilingan holda.',
    type: PublicationListItemDto,
    paginated: true,
    validation: true,
  })
  findPublished(@Query() query: PaginationQueryDto, @Lang() lang: Language) {
    return this.announcementsService.findPublished(query, lang);
  }

  @Get('full')
  @ApiDocs({
    summary: 'E’lonlar (admin, barcha tillar)',
    type: Announcement,
    paginated: true,
    auth: true,
    validation: true,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.announcementsService.findAll(query);
  }

  @Get(':id/full')
  @ApiDocs({
    summary: 'E’lon (admin, barcha tillar)',
    type: Announcement,
    auth: true,
    notFound: NOT_FOUND,
    withId: true,
  })
  findOne(@IdParam() id: number) {
    return this.announcementsService.findOne(id);
  }

  @Get(':slug')
  @ApiParam({
    name: 'slug',
    example: 'xalqaro-ilmiy-konferensiya-2026',
    description: 'Slug yoki ID',
  })
  @ApiDocs({
    summary: 'E’lonni slug orqali olish (ommaviy)',
    description: 'Ko‘rishlar soni bittaga oshadi, javobda o‘xshash yozuvlar ham qaytadi.',
    type: PublicationDetailDto,
    notFound: NOT_FOUND,
  })
  findPublishedOne(@Param('slug') slug: string, @Lang() lang: Language) {
    return this.announcementsService.findPublishedOne(slug, lang);
  }

  @Post(':slug/like')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiParam({ name: 'slug', example: 'xalqaro-ilmiy-konferensiya-2026' })
  @ApiDocs({
    summary: 'E’longa yoqtirish bosish',
    type: LikeResultDto,
    status: HttpStatus.OK,
    message: 'Fikringiz uchun rahmat',
    notFound: NOT_FOUND,
  })
  like(@Param('slug') slug: string) {
    return this.announcementsService.like(slug);
  }

  @Post()
  @ApiDocs({
    summary: 'E’lon yaratish',
    type: Announcement,
    status: HttpStatus.CREATED,
    message: 'E’lon yaratildi',
    auth: true,
    validation: true,
    conflict: 'Bunday qiymatli yozuv allaqachon mavjud',
  })
  create(@Body() dto: CreatePublicationDto, @CurrentUser('sub') userId: number) {
    return this.announcementsService.create(dto, userId);
  }

  @Put(':id')
  @ApiDocs({
    summary: 'E’lonni tahrirlash',
    type: Announcement,
    message: 'E’lon yangilandi',
    auth: true,
    validation: true,
    notFound: NOT_FOUND,
    conflict: 'Bunday qiymatli yozuv allaqachon mavjud',
  })
  update(@IdParam() id: number, @Body() dto: UpdatePublicationDto) {
    return this.announcementsService.update(id, dto);
  }

  @Delete(':id')
  @ApiDocs({
    summary: 'E’lonni o‘chirish',
    message: 'E’lon o‘chirildi',
    auth: true,
    notFound: NOT_FOUND,
    withId: true,
  })
  async remove(@IdParam() id: number) {
    await this.announcementsService.remove(id);
    return null;
  }
}
