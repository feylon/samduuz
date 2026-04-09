import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ApiDocs } from '../../common/decorators/api-docs.decorator';
import { DashboardStatsDto } from './stats.dto';
import { StatsService } from './stats.service';

@ApiTags('Stats')
@Controller('stats')
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get()
  @ApiDocs({
    summary: 'Boshqaruv paneli statistikasi',
    description: 'Yozuvlar soni, ko‘rishlar va oxirgi qo‘shilgan materiallar.',
    type: DashboardStatsDto,
    auth: true,
  })
  dashboard() {
    return this.statsService.dashboard();
  }
}
