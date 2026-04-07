import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '../../common/enums/language.enum';
import { pickLocale } from '../../common/utils/localize';
import { Page } from '../pages/entities/page.entity';
import { CreateMenuDto } from './dto/create-menu.dto';
import { PublicMenuDto } from './dto/public-menu.dto';
import { UpdateMenuDto } from './dto/update-menu.dto';
import { Menu } from './entities/menu.entity';

const MAX_DEPTH = 3;

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu) private readonly menus: Repository<Menu>,
    @InjectRepository(Page) private readonly pages: Repository<Page>,
  ) {}

  async findTree() {
    const all = await this.menus.find({
      relations: { relatedPage: true },
      order: { priority: 'ASC', id: 'ASC' },
    });
    return this.buildTree(all);
  }

  async findPublicTree(lang: Language): Promise<PublicMenuDto[]> {
    const tree = await this.findTree();
    const localize = (menu: Menu): PublicMenuDto => ({
      id: menu.id,
      name: pickLocale(menu, 'name', lang),
      priority: menu.priority,
      link: menu.externalLink || (menu.relatedPage ? `/pages/${menu.relatedPage.slug}` : null),
      isExternal: Boolean(menu.externalLink?.startsWith('http')),
      children: menu.children.map(localize),
    });
    return tree.map(localize);
  }

  async findOne(id: number) {
    const menu = await this.menus.findOne({ where: { id }, relations: { relatedPage: true } });
    if (!menu) throw new NotFoundException('Menyu topilmadi');
    return menu;
  }

  async create(dto: CreateMenuDto, ownerId: number) {
    await this.validateRelations(dto);
    const saved = await this.menus.save(this.menus.create({ ...dto, ownerId }));
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateMenuDto) {
    const menu = await this.findOne(id);
    await this.validateRelations(dto, id);
    Object.assign(menu, dto);
    if (dto.relatedPageId !== undefined) {
      menu.relatedPage = dto.relatedPageId ? ({ id: dto.relatedPageId } as Page) : null;
    }
    await this.menus.save(menu);
    return this.findOne(id);
  }

  async remove(id: number) {
    const menu = await this.findOne(id);
    await this.menus.remove(menu);
  }

  private buildTree(items: Menu[]) {
    const byId = new Map<number, Menu>();
    items.forEach((item) => byId.set(item.id, { ...item, children: [] } as Menu));

    const roots: Menu[] = [];
    byId.forEach((item) => {
      const parent = item.parentId ? byId.get(item.parentId) : undefined;
      if (parent) parent.children.push(item);
      else roots.push(item);
    });
    return roots;
  }

  private async validateRelations(dto: UpdateMenuDto, selfId?: number) {
    if (dto.relatedPageId) {
      const pageExists = await this.pages.exists({ where: { id: dto.relatedPageId } });
      if (!pageExists) throw new BadRequestException('Bog‘lanadigan sahifa topilmadi');
    }

    if (!dto.parentId) return;
    if (dto.parentId === selfId) {
      throw new BadRequestException('Menyu o‘zini o‘ziga ota qilib bo‘lmaydi');
    }

    let depth = 1;
    let cursor: number | null = dto.parentId;
    while (cursor) {
      const parent = await this.menus.findOne({
        where: { id: cursor },
        select: { id: true, parentId: true },
      });
      if (!parent) throw new BadRequestException('Ota menyu topilmadi');
      if (parent.id === selfId) {
        throw new BadRequestException('Menyuni o‘zining ichki elementiga ko‘chirib bo‘lmaydi');
      }
      depth += 1;
      cursor = parent.parentId;
    }

    if (depth > MAX_DEPTH) {
      throw new BadRequestException(`Menyu chuqurligi ${MAX_DEPTH} darajadan oshmasligi kerak`);
    }
  }
}
