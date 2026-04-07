import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Page } from '../pages/entities/page.entity';
import { Menu } from './entities/menu.entity';
import { MenusController } from './menus.controller';
import { MenusService } from './menus.service';

@Module({
  imports: [TypeOrmModule.forFeature([Menu, Page])],
  controllers: [MenusController],
  providers: [MenusService],
  exports: [TypeOrmModule],
})
export class MenusModule {}
