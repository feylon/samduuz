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
import { News } from './entities/news.entity';
import { NewsService } from './news.service';

const NOT_FOUND = 'Yangilik topilmadi';

@ApiTags('News')
@Controller('news')
export class NewsController {
  constructor(private readonly newsService: NewsService) {}

  @Get()
  @ApiDocs({
    summary: 'Yangiliklar ro‘yxati (ommaviy)',
    description: 'Faqat chop etilgan yozuvlar, tanlangan tilga tarjima qilingan holda.',
    type: PublicationListItemDto,
    paginated: true,
    validation: true,
  })
  findPublished(@Query() query: PaginationQueryDto, @Lang() lang: Language) {
    return this.newsService.findPublished(query, lang);
  }

  @Get('full')
  @ApiDocs({
    summary: 'Yangiliklar (admin, barcha tillar)',
    type: News,
    paginated: true,
    auth: true,
    validation: true,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.newsService.findAll(query);
  }

  @Get(':id/full')
  @ApiDocs({
    summary: 'Yangilik (admin, barcha tillar)',
    type: News,
    auth: true,
    notFound: NOT_FOUND,
    withId: true,
  })
  findOne(@IdParam() id: number) {
    return this.newsService.findOne(id);
  }

  @Get(':slug')
  @ApiParam({
    name: 'slug',
    example: 'xalqaro-ilmiy-konferensiya-2026',
    description: 'Slug yoki ID',
  })
  @ApiDocs({
    summary: 'Yangilikni slug orqali olish (ommaviy)',
    description: 'Ko‘rishlar soni bittaga oshadi, javobda o‘xshash yozuvlar ham qaytadi.',
    type: PublicationDetailDto,
    notFound: NOT_FOUND,
  })
  findPublishedOne(@Param('slug') slug: string, @Lang() lang: Language) {
    return this.newsService.findPublishedOne(slug, lang);
  }

  @Post(':slug/like')
  @Throttle({ default: { limit: 5, ttl: 60_000 } })
  @ApiParam({ name: 'slug', example: 'xalqaro-ilmiy-konferensiya-2026' })
  @ApiDocs({
    summary: 'Yangilikga yoqtirish bosish',
    type: LikeResultDto,
    status: HttpStatus.OK,
    message: 'Fikringiz uchun rahmat',
    notFound: NOT_FOUND,
  })
  like(@Param('slug') slug: string) {
    return this.newsService.like(slug);
  }

  @Post()
  @ApiDocs({
    summary: 'Yangilik yaratish',
    type: News,
    status: HttpStatus.CREATED,
    message: 'Yangilik yaratildi',
    auth: true,
    validation: true,
    conflict: 'Bunday qiymatli yozuv allaqachon mavjud',
  })
  create(@Body() dto: CreatePublicationDto, @CurrentUser('sub') userId: number) {
    return this.newsService.create(dto, userId);
  }

  @Put(':id')
  @ApiDocs({
    summary: 'Yangilikni tahrirlash',
    type: News,
    message: 'Yangilik yangilandi',
    auth: true,
    validation: true,
    notFound: NOT_FOUND,
    conflict: 'Bunday qiymatli yozuv allaqachon mavjud',
  })
  update(@IdParam() id: number, @Body() dto: UpdatePublicationDto) {
    return this.newsService.update(id, dto);
  }

  @Delete(':id')
  @ApiDocs({
    summary: 'Yangilikni o‘chirish',
    message: 'Yangilik o‘chirildi',
    auth: true,
    notFound: NOT_FOUND,
    withId: true,
  })
  async remove(@IdParam() id: number) {
    await this.newsService.remove(id);
    return null;
  }
}
