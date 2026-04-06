import { Body, Controller, Delete, Get, HttpStatus, Post, Put, Query } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from '../../common/decorators/api-docs.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IdParam } from '../../common/decorators/id-param.decorator';
import { Lang } from '../../common/decorators/lang.decorator';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Language } from '../../common/enums/language.enum';
import { CreateSlideDto } from './dto/create-slide.dto';
import { PublicSlideDto } from './dto/public-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { Slide } from './entities/slide.entity';
import { SlidesService } from './slides.service';

const NOT_FOUND = 'Slayd topilmadi';

@ApiTags('Slides')
@Controller('slides')
export class SlidesController {
  constructor(private readonly slidesService: SlidesService) {}

  @Get()
  @ApiDocs({
    summary: 'Faol slaydlar (ommaviy)',
    description: 'Bosh sahifadagi karusel uchun, priority bo‘yicha tartiblangan.',
    type: PublicSlideDto,
    isArray: true,
  })
  findActive(@Lang() lang: Language) {
    return this.slidesService.findActive(lang);
  }

  @Get('full')
  @ApiDocs({
    summary: 'Barcha slaydlar (admin)',
    type: Slide,
    paginated: true,
    auth: true,
    validation: true,
  })
  findAll(@Query() query: PaginationQueryDto) {
    return this.slidesService.findAll(query);
  }

  @Get(':id')
  @ApiDocs({ summary: 'Slayd (admin)', type: Slide, auth: true, notFound: NOT_FOUND, withId: true })
  findOne(@IdParam() id: number) {
    return this.slidesService.findOne(id);
  }

  @Post()
  @ApiDocs({
    summary: 'Slayd yaratish',
    type: Slide,
    status: HttpStatus.CREATED,
    message: 'Slayd yaratildi',
    auth: true,
    validation: true,
  })
  create(@Body() dto: CreateSlideDto, @CurrentUser('sub') userId: number) {
    return this.slidesService.create(dto, userId);
  }

  @Put(':id')
  @ApiDocs({
    summary: 'Slaydni tahrirlash',
    type: Slide,
    message: 'Slayd yangilandi',
    auth: true,
    validation: true,
    notFound: NOT_FOUND,
  })
  update(@IdParam() id: number, @Body() dto: UpdateSlideDto) {
    return this.slidesService.update(id, dto);
  }

  @Delete(':id')
  @ApiDocs({
    summary: 'Slaydni o‘chirish',
    message: 'Slayd o‘chirildi',
    auth: true,
    notFound: NOT_FOUND,
    withId: true,
  })
  async remove(@IdParam() id: number) {
    await this.slidesService.remove(id);
    return null;
  }
}
