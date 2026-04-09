import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from '../../common/decorators/api-docs.decorator';
import { SitemapDto } from './seo.dto';
import { SeoService } from './seo.service';

@ApiTags('SEO')
@Controller('seo')
export class SeoController {
  constructor(private readonly seoService: SeoService) {}

  @Get('sitemap')
  @ApiDocs({
    summary: 'Sitemap uchun ma’lumotlar',
    description: 'Frontend `sitemap.xml` faylini shu ma’lumotlar asosida yaratadi.',
    type: SitemapDto,
  })
  sitemap() {
    return this.seoService.sitemap();
  }
}
