import { Body, Controller, Delete, Get, HttpStatus, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from '../../common/decorators/api-docs.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IdParam } from '../../common/decorators/id-param.decorator';
import { Lang } from '../../common/decorators/lang.decorator';
import { Language } from '../../common/enums/language.enum';
import { CreateUsefulLinkDto } from './dto/create-useful-link.dto';
import { PublicUsefulLinkDto } from './dto/public-useful-link.dto';
import { UpdateUsefulLinkDto } from './dto/update-useful-link.dto';
import { UsefulLink } from './entities/useful-link.entity';
import { UsefulLinksService } from './useful-links.service';

const NOT_FOUND = 'Foydali havola topilmadi';

@ApiTags('Useful links')
@Controller('useful-links')
export class UsefulLinksController {
  constructor(private readonly usefulLinksService: UsefulLinksService) {}

  @Get()
  @ApiDocs({
    summary: 'Faol foydali havolalar (ommaviy)',
    type: PublicUsefulLinkDto,
    isArray: true,
  })
  findActive(@Lang() lang: Language) {
    return this.usefulLinksService.findActive(lang);
  }

  @Get('full')
  @ApiDocs({
    summary: 'Barcha foydali havolalar (admin)',
    type: UsefulLink,
    isArray: true,
    auth: true,
  })
  findAll() {
    return this.usefulLinksService.findAll();
  }

  @Get(':id/full')
  @ApiDocs({
    summary: 'Foydali havola (admin)',
    type: UsefulLink,
    auth: true,
    notFound: NOT_FOUND,
    withId: true,
  })
  findOne(@IdParam() id: number) {
    return this.usefulLinksService.findOne(id);
  }

  @Post()
  @ApiDocs({
    summary: 'Foydali havola yaratish',
    type: UsefulLink,
    status: HttpStatus.CREATED,
    message: 'Foydali havola yaratildi',
    auth: true,
    validation: true,
  })
  create(@Body() dto: CreateUsefulLinkDto, @CurrentUser('sub') userId: number) {
    return this.usefulLinksService.create(dto, userId);
  }

  @Put(':id')
  @ApiDocs({
    summary: 'Foydali havolani tahrirlash',
    type: UsefulLink,
    message: 'Foydali havola yangilandi',
    auth: true,
    validation: true,
    notFound: NOT_FOUND,
  })
  update(@IdParam() id: number, @Body() dto: UpdateUsefulLinkDto) {
    return this.usefulLinksService.update(id, dto);
  }

  @Delete(':id')
  @ApiDocs({
    summary: 'Foydali havolani o‘chirish',
    message: 'Foydali havola o‘chirildi',
    auth: true,
    notFound: NOT_FOUND,
    withId: true,
  })
  async remove(@IdParam() id: number) {
    await this.usefulLinksService.remove(id);
    return null;
  }
}
