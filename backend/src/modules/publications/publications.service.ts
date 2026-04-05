import { NotFoundException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { PaginationQueryDto } from '../../common/dto/pagination-query.dto';
import { Language } from '../../common/enums/language.enum';
import { pickLocale } from '../../common/utils/localize';
import { toPaginated } from '../../common/utils/paginate';
import { generateUniqueSlug, isNumericId } from '../../common/utils/slug-generator';
import { CreatePublicationDto } from './dto/create-publication.dto';
import { PublicationDetailDto, PublicationListItemDto } from './dto/publication-response.dto';
import { UpdatePublicationDto } from './dto/update-publication.dto';
import { Publication } from './publication.entity';

export abstract class PublicationsService<T extends Publication> {
  protected abstract readonly notFoundMessage: string;

  protected constructor(protected readonly repository: Repository<T>) {}

  async findPublished({ page, pageSize, search }: PaginationQueryDto, lang: Language) {
    const query = this.repository
      .createQueryBuilder('item')
      .where('item.isPublished = true')
      .andWhere('item.publishedAt <= now()')
      .orderBy('item.publishedAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (search) {
      query.andWhere(
        '(item.titleUz ILIKE :search OR item.titleKr ILIKE :search OR item.titleRu ILIKE :search OR item.titleEn ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    const [items, total] = await query.getManyAndCount();
    return toPaginated(
      items.map((item) => this.toListItem(item, lang)),
      total,
      page,
      pageSize,
    );
  }

  async findPublishedOne(slugOrId: string, lang: Language): Promise<PublicationDetailDto> {
    const item = await this.findVisible(slugOrId);
    await this.repository.increment({ id: item.id } as never, 'views', 1);

    const related = await this.repository
      .createQueryBuilder('item')
      .where('item.isPublished = true')
      .andWhere('item.publishedAt <= now()')
      .andWhere('item.id != :id', { id: item.id })
      .orderBy('item.publishedAt', 'DESC')
      .take(4)
      .getMany();

    return {
      ...this.toListItem(item, lang),
      views: item.views + 1,
      content: pickLocale(item, 'content', lang),
      related: related.map((entry) => this.toListItem(entry, lang)),
    };
  }

  async like(slugOrId: string) {
    const item = await this.findVisible(slugOrId);
    await this.repository.increment({ id: item.id } as never, 'likes', 1);
    return { likes: item.likes + 1 };
  }

  async findAll({ page, pageSize, search }: PaginationQueryDto) {
    const query = this.repository
      .createQueryBuilder('item')
      .orderBy('item.publishedAt', 'DESC')
      .skip((page - 1) * pageSize)
      .take(pageSize);

    if (search) {
      query.where('(item.titleUz ILIKE :search OR item.slug ILIKE :search)', {
        search: `%${search}%`,
      });
    }

    const [items, total] = await query.getManyAndCount();
    return toPaginated(items, total, page, pageSize);
  }

  async findOne(id: number) {
    const item = await this.repository.findOne({ where: { id } as never });
    if (!item) throw new NotFoundException(this.notFoundMessage);
    return item;
  }

  async create(dto: CreatePublicationDto, ownerId: number) {
    const slug = await generateUniqueSlug(this.repository, dto.slug ?? dto.titleUz);
    const entity = this.repository.create({ ...dto, slug, ownerId } as never);
    return this.repository.save(entity);
  }

  async update(id: number, dto: UpdatePublicationDto) {
    const item = await this.findOne(id);
    if (dto.slug && dto.slug !== item.slug) {
      dto.slug = await generateUniqueSlug(this.repository, dto.slug, id);
    }
    Object.assign(item, dto);
    return this.repository.save(item);
  }

  async remove(id: number) {
    const item = await this.findOne(id);
    await this.repository.softRemove(item);
  }

  private async findVisible(slugOrId: string) {
    const query = this.repository
      .createQueryBuilder('item')
      .where('item.isPublished = true')
      .andWhere('item.publishedAt <= now()');

    if (isNumericId(slugOrId)) {
      query.andWhere('(item.slug = :slug OR item.id = :id)', {
        slug: slugOrId,
        id: Number(slugOrId),
      });
    } else {
      query.andWhere('item.slug = :slug', { slug: slugOrId });
    }

    const item = await query.getOne();
    if (!item) throw new NotFoundException(this.notFoundMessage);
    return item;
  }

  protected toListItem(item: T, lang: Language): PublicationListItemDto {
    return {
      id: item.id,
      slug: item.slug,
      title: pickLocale(item, 'title', lang),
      description: pickLocale(item, 'description', lang),
      mainImagePath: item.mainImagePath,
      views: item.views,
      likes: item.likes,
      publishedAt: item.publishedAt,
      updatedAt: item.updatedAt,
    };
  }
}
