import { Body, Controller, Delete, Get, HttpStatus, Post, Put } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from '../../common/decorators/api-docs.decorator';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { IdParam } from '../../common/decorators/id-param.decorator';
import { Lang } from '../../common/decorators/lang.decorator';
import { Language } from '../../common/enums/language.enum';
import { CreateMenuDto } from './dto/create-menu.dto';
import { PublicMenuDto } from './dto/public-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';
import { MenusService } from './menus.service';

const NOT_FOUND = 'Menyu topilmadi';

@ApiTags('Menus')
@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get()
  @ApiDocs({
    summary: 'Sayt menyusi daraxti (ommaviy)',
    description: 'Tanlangan tilga tarjima qilingan, ichma-ich joylashgan menyu.',
    type: PublicMenuDto,
    isArray: true,
  })
  findPublicTree(@Lang() lang: Language) {
    return this.menusService.findPublicTree(lang);
  }

  @Get('full')
  @ApiDocs({
    summary: 'Menyu daraxti (admin, barcha tillar)',
    type: Menu,
    isArray: true,
    auth: true,
  })
  findTree() {
    return this.menusService.findTree();
  }

  @Get(':id')
  @ApiDocs({
    summary: 'Menyu elementi (admin)',
    type: Menu,
    auth: true,
    notFound: NOT_FOUND,
    withId: true,
  })
  findOne(@IdParam() id: number) {
    return this.menusService.findOne(id);
  }

  @Post()
  @ApiDocs({
    summary: 'Menyu elementi yaratish',
    description: 'Menyu chuqurligi 3 darajagacha ruxsat etiladi.',
    type: Menu,
    status: HttpStatus.CREATED,
    message: 'Menyu yaratildi',
    auth: true,
    validation: true,
  })
  create(@Body() dto: CreateMenuDto, @CurrentUser('sub') userId: number) {
    return this.menusService.create(dto, userId);
  }

  @Put(':id')
  @ApiDocs({
    summary: 'Menyu elementini tahrirlash',
    type: Menu,
    message: 'Menyu yangilandi',
    auth: true,
    validation: true,
    notFound: NOT_FOUND,
  })
  update(@IdParam() id: number, @Body() dto: UpdateMenuDto) {
    return this.menusService.update(id, dto);
  }

  @Delete(':id')
  @ApiDocs({
    summary: 'Menyu elementini o‘chirish',
    description: 'Ichki elementlar ham birga o‘chiriladi.',
    message: 'Menyu o‘chirildi',
    auth: true,
    notFound: NOT_FOUND,
    withId: true,
  })
  async remove(@IdParam() id: number) {
    await this.menusService.remove(id);
    return null;
  }
}
