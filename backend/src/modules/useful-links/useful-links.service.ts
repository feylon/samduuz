import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Language } from '../../common/enums/language.enum';
import { pickLocale } from '../../common/utils/localize';
import { CreateUsefulLinkDto } from './dto/create-useful-link.dto';
import { PublicUsefulLinkDto } from './dto/public-useful-link.dto';
import { UpdateUsefulLinkDto } from './dto/update-useful-link.dto';
import { UsefulLink } from './entities/useful-link.entity';

@Injectable()
export class UsefulLinksService {
  constructor(@InjectRepository(UsefulLink) private readonly links: Repository<UsefulLink>) {}

  async findActive(lang: Language): Promise<PublicUsefulLinkDto[]> {
    const links = await this.links.find({
      where: { isActive: true },
      order: { priority: 'ASC', id: 'ASC' },
    });
    return links.map((link) => ({
      id: link.id,
      name: pickLocale(link, 'name', lang),
      externalLink: link.externalLink,
      imagePath: link.imagePath,
    }));
  }

  findAll() {
    return this.links.find({ order: { priority: 'ASC', id: 'ASC' } });
  }

  async findOne(id: number) {
    const link = await this.links.findOne({ where: { id } });
    if (!link) throw new NotFoundException('Foydali havola topilmadi');
    return link;
  }

  create(dto: CreateUsefulLinkDto, ownerId: number) {
    return this.links.save(this.links.create({ ...dto, ownerId }));
  }

  async update(id: number, dto: UpdateUsefulLinkDto) {
    const link = await this.findOne(id);
    Object.assign(link, dto);
    return this.links.save(link);
  }

  async remove(id: number) {
    const link = await this.findOne(id);
    await this.links.softRemove(link);
  }
}
