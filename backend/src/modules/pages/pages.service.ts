import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '../../common/enums/language.enum';
import { pickLocale } from '../../common/utils/localize';
import { toPaginated } from '../../common/utils/paginate';
import { generateUniqueSlug, isNumericId } from '../../common/utils/slug-generator';
import { makeExcerpt } from '../../common/utils/text';
import { CreatePageDto } from './dto/create-page.dto';
import { PageOptionDto, PublicPageDto } from './dto/page-response.dto';
import { PageQueryDto } from './dto/page-query.dto';
import { UpdatePageDto } from './dto/update-page.dto';
import { Page } from './entities/page.entity';

const NOT_FOUND = 'Sahifa topilmadi';

@Injectable()
export class PagesService {
  constructor(@InjectRepository(Page) private readonly pages: Repository<Page>) {}

  async findAll({ page, pageSize, search, pageType }: PageQueryDto) {
    const query = this.pages
      .createQueryBuilder('page')
      .orderBy('page.updatedAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (pageType !== undefined) query.andWhere('page.pageType = :pageType', { pageType });
    if (search) {
      query.andWhere('(page.titleUz ILIKE :search OR page.slug ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [items, total] = await query.getManyAndCount();
    return toPaginated(items, total, page, pageSize);
  }

  findOptions(): Promise<PageOptionDto[]> {
    return this.pages.find({
      select: { id: true, titleUz: true, slug: true, pageType: true },
      order: { titleUz: 'ASC' },
    });
  }

  async findOne(id: number) {
    const page = await this.pages.findOne({ where: { id } });
    if (!page) throw new NotFoundException(NOT_FOUND);
    return page;
  }

  async findPublic(slugOrId: string, lang: Language): Promise<PublicPageDto> {
    const where = isNumericId(slugOrId)
      ? [
          { slug: slugOrId, isPublished: true },
          { id: Number(slugOrId), isPublished: true },
        ]
      : { slug: slugOrId, isPublished: true };
    const page = await this.pages.findOne({ where });
    if (!page) throw new NotFoundException(NOT_FOUND);

    await this.pages.increment({ id: page.id }, 'views', 1);
    return this.localize(page, lang, page.views + 1);
  }

  async create(dto: CreatePageDto, ownerId: number) {
    const slug = await generateUniqueSlug(this.pages, dto.slug ?? dto.titleUz);
    return this.pages.save(this.pages.create({ ...dto, slug, ownerId }));
  }

  async update(id: number, dto: UpdatePageDto) {
    const page = await this.findOne(id);
    if (dto.slug && dto.slug !== page.slug) {
      dto.slug = await generateUniqueSlug(this.pages, dto.slug, id);
    }
    Object.assign(page, dto);
    return this.pages.save(page);
  }

  async remove(id: number) {
    const page = await this.findOne(id);
    await this.pages.softRemove(page);
  }

  private localize(page: Page, lang: Language, views = page.views): PublicPageDto {
    const content = pickLocale(page, 'content', lang);
    return {
      id: page.id,
      slug: page.slug,
      pageType: page.pageType,
      title: pickLocale(page, 'title', lang),
      content,
      excerpt: makeExcerpt(content),
      views,
      createdAt: page.createdAt,
      updatedAt: page.updatedAt,
    };
  }
}
