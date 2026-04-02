import { Controller, Get } from '@nestjs/common';
import { ApiProperty, ApiTags } from '@nestjs/swagger';
import { DataSource } from 'typeorm';
import { ApiDocs } from '../../common/decorators/api-docs.decorator';

class HealthDto {
  @ApiProperty({ example: 'ok' })
  status: string;

  @ApiProperty({ example: 'up' })
  database: string;

  @ApiProperty({ example: 1234.56 })
  uptime: number;
}

@ApiTags('Health')
@Controller('health')
export class HealthController {
  constructor(private readonly dataSource: DataSource) {}

  @Get()
  @ApiDocs({ summary: 'Servis holatini tekshirish', type: HealthDto, message: 'Servis ishlamoqda' })
  async check(): Promise<HealthDto> {
    let database = 'up';
    try {
      await this.dataSource.query('SELECT 1');
    } catch {
      database = 'down';
    }
    return { status: 'ok', database, uptime: Math.round(process.uptime() * 100) / 100 };
  }
}
