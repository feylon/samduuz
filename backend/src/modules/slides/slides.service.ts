import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Language } from '../../common/enums/language.enum';
import { pickLocale } from '../../common/utils/localize';
import { toPaginated } from '../../common/utils/paginate';
import { Page } from '../pages/entities/page.entity';
import { CreateSlideDto } from './dto/create-slide.dto';
import { PublicSlideDto } from './dto/public-slide.dto';
import { UpdateSlideDto } from './dto/update-slide.dto';
import { Slide } from './entities/slide.entity';

@Injectable()
export class SlidesService {
  constructor(
    @InjectRepository(Slide) private readonly slides: Repository<Slide>,
    @InjectRepository(Page) private readonly pages: Repository<Page>,
  ) {}

  async findActive(lang: Language): Promise<PublicSlideDto[]> {
    const slides = await this.slides.find({
      where: { isActive: true },
      relations: { relatedPage: true },
      order: { priority: 'ASC', createdAt: 'DESC' },
    });

    return slides.map((slide) => {
      const pageLink = slide.relatedPage ? `/pages/${slide.relatedPage.slug}` : null;
      return {
        id: slide.id,
        title: pickLocale(slide, 'title', lang),
        description: pickLocale(slide, 'description', lang),
        mainImagePath: slide.mainImagePath,
        link: slide.externalLink || pageLink,
        isExternal: Boolean(slide.externalLink),
      };
    });
  }

  async findAll({ page, pageSize, search }: PaginationQueryDto) {
    const query = this.slides
      .createQueryBuilder('slide')
      .leftJoinAndSelect('slide.relatedPage', 'relatedPage')
      .orderBy('slide.priority', 'ASC')
      .addOrderBy('slide.createdAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (search) query.where('slide.titleUz ILIKE :search', { search: `%${search}%` });

    const [items, total] = await query.getManyAndCount();
    return toPaginated(items, total, page, pageSize);
  }

  async findOne(id: number) {
    const slide = await this.slides.findOne({ where: { id }, relations: { relatedPage: true } });
    if (!slide) throw new NotFoundException('Slayd topilmadi');
    return slide;
  }

  async create(dto: CreateSlideDto, ownerId: number) {
    await this.assertPageExists(dto.relatedPageId);
    const saved = await this.slides.save(this.slides.create({ ...dto, ownerId }));
    return this.findOne(saved.id);
  }

  async update(id: number, dto: UpdateSlideDto) {
    const slide = await this.findOne(id);
    await this.assertPageExists(dto.relatedPageId);
    Object.assign(slide, dto);
    if (dto.relatedPageId !== undefined) {
      slide.relatedPage = dto.relatedPageId ? ({ id: dto.relatedPageId } as Page) : null;
    }
    await this.slides.save(slide);
    return this.findOne(id);
  }

  async remove(id: number) {
    const slide = await this.findOne(id);
    await this.slides.softRemove(slide);
  }

  private async assertPageExists(pageId?: number | null) {
    if (!pageId) return;
    const exists = await this.pages.exists({ where: { id: pageId } });
    if (!exists) throw new BadRequestException('Bog‘lanadigan sahifa topilmadi');
  }
}
