import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Query } from '@nestjs/common';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ApiDocs } from '../../common/decorators/api-docs.decorator';
import { IdParam } from '../../common/decorators/id-param.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { Lang } from '../../common/decorators/lang.decorator';
import { Language } from '../../common/enums/language.enum';
import { CreatePageDto } from './dto/create-page.dto';
import { PageOptionDto, PublicPageDto } from './dto/page-response.dto';
import { PageQueryDto } from './dto/page-query.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';
import { PagesService } from './pages.service';

const NOT_FOUND = 'Sahifa topilmadi';

@ApiTags('Pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Get('full')
  @ApiDocs({
    summary: 'Barcha sahifalar (admin)',
    description: 'Barcha tillardagi maydonlar bilan sahifalangan ro‘yxat.',
    type: Page,
    paginated: true,
    auth: true,
    validation: true,
  })
  findAll(@Query() query: PageQueryDto) {
    return this.pagesService.findAll(query);
  }

  @Get('options')
  @ApiDocs({
    summary: 'Sahifalar ro‘yxati (tanlash uchun)',
    description: 'Menyu va slaydlarda sahifa tanlash uchun qisqa ro‘yxat.',
    type: PageOptionDto,
    isArray: true,
    auth: true,
  })
  findOptions() {
    return this.pagesService.findOptions();
  }

  @Get(':id/full')
  @ApiDocs({
    summary: 'Sahifa (admin, barcha tillar)',
    type: Page,
    auth: true,
    notFound: NOT_FOUND,
    withId: true,
  })
  findOne(@IdParam() id: number) {
    return this.pagesService.findOne(id);
  }

  @Get(':slug')
  @ApiParam({ name: 'slug', example: 'universitet-tarixi', description: 'Slug yoki ID' })
  @ApiDocs({
    summary: 'Sahifani slug orqali olish (ommaviy)',
    description:
      'Tanlangan tilga tarjima qilingan sahifa. Har bir so‘rov ko‘rishlar sonini oshiradi.',
    type: PublicPageDto,
    notFound: NOT_FOUND,
  })
  findPublic(@Param('slug') slug: string, @Lang() lang: Language) {
    return this.pagesService.findPublic(slug, lang);
  }

  @Post()
  @ApiDocs({
    summary: 'Sahifa yaratish',
    type: Page,
    status: HttpStatus.CREATED,
    message: 'Sahifa yaratildi',
    auth: true,
    validation: true,
    conflict: 'Bunday qiymatli yozuv allaqachon mavjud',
  })
  create(@Body() dto: CreatePageDto, @CurrentUser('sub') userId: number) {
    return this.pagesService.create(dto, userId);
  }

  @Put(':id')
  @ApiDocs({
    summary: 'Sahifani tahrirlash',
    type: Page,
    message: 'Sahifa yangilandi',
    auth: true,
    validation: true,
    notFound: NOT_FOUND,
    conflict: 'Bunday qiymatli yozuv allaqachon mavjud',
  })
  update(@IdParam() id: number, @Body() dto: UpdatePageDto) {
    return this.pagesService.update(id, dto);
  }

  @Delete(':id')
  @ApiDocs({
    summary: 'Sahifani o‘chirish',
    message: 'Sahifa o‘chirildi',
    auth: true,
    notFound: NOT_FOUND,
    withId: true,
  })
  async remove(@IdParam() id: number) {
    await this.pagesService.remove(id);
    return null;
  }
}
