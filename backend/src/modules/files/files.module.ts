import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MulterModule } from '@nestjs/platform-express';
import { memoryStorage } from 'multer';
import { FilesController } from './files.controller';
import { FilesService } from './files.service';

@Module({
  imports: [
    MulterModule.registerAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => ({
        storage: memoryStorage(),
        limits: { fileSize: config.get<number>('UPLOAD_MAX_SIZE_MB', 20) * 1024 * 1024 },
      }),
    }),
  ],
  controllers: [FilesController],
  providers: [FilesService],
  exports: [FilesService],
})
export class FilesModule {}
