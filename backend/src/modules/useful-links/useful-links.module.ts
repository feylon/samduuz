import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsefulLink } from './entities/useful-link.entity';
import { UsefulLinksController } from './useful-links.controller';
import { UsefulLinksService } from './useful-links.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsefulLink])],
  controllers: [UsefulLinksController],
  providers: [UsefulLinksService],
  exports: [TypeOrmModule],
})
export class UsefulLinksModule {}
