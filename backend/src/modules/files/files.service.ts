import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
  OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { existsSync } from 'fs';
import { mkdir, readdir, rename, rm, stat, unlink, writeFile } from 'fs/promises';
import { extname, join, relative, resolve, sep } from 'path';
import { slugify } from '../../common/utils/slugify';
import { FileItemDto, FolderListDto } from './dto/file-response.dto';

const KINDS: Record<string, string[]> = {
  image: ['.jpg', '.jpeg', '.png', '.webp', '.gif', '.svg', '.avif'],
  video: ['.mp4', '.webm'],
  document: ['.pdf', '.doc', '.docx', '.xls', '.xlsx', '.ppt', '.pptx', '.txt'],
  archive: ['.zip', '.rar'],
};

const ALLOWED_EXTENSIONS = new Set(Object.values(KINDS).flat());

const kindOf = (fileName: string) => {
  const extension = extname(fileName).toLowerCase();
  return Object.keys(KINDS).find((kind) => KINDS[kind].includes(extension)) ?? 'other';
};

@Injectable()
export class FilesService implements OnModuleInit {
  readonly root: string;

  constructor(config: ConfigService) {
    this.root = resolve(config.get<string>('UPLOAD_DIR', 'uploads'));
  }

  async onModuleInit() {
    await mkdir(this.root, { recursive: true });
  }

  async listFiles(path?: string): Promise<FileItemDto[]> {
    const directory = await this.existingDirectory(path);
    const entries = await readdir(directory, { withFileTypes: true });

    const files = await Promise.all(
      entries
        .filter((entry) => entry.isFile() && !entry.name.startsWith('.'))
        .map(async (entry) => {
          const absolute = join(directory, entry.name);
          const info = await stat(absolute);
          return {
            name: entry.name,
            url: this.toPublicPath(absolute),
            size: info.size,
            kind: kindOf(entry.name),
            modifiedAt: info.mtime,
          };
        }),
    );

    return files.sort((a, b) => b.modifiedAt.getTime() - a.modifiedAt.getTime());
  }

  async listFolders(path?: string): Promise<FolderListDto> {
    const directory = await this.existingDirectory(path);
    const entries = await readdir(directory, { withFileTypes: true });
    return {
      folders: entries
        .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.'))
        .map((entry) => entry.name)
        .sort((a, b) => a.localeCompare(b)),
    };
  }

  async upload(file: Express.Multer.File | undefined, path?: string): Promise<FileItemDto> {
    if (!file) throw new BadRequestException('Yuklash uchun fayl tanlanmagan');

    const originalName = Buffer.from(file.originalname, 'latin1').toString('utf8');
    const extension = extname(originalName).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(extension)) {
      throw new BadRequestException(
        `"${extension || originalName}" turidagi fayllarni yuklab bo‘lmaydi`,
      );
    }

    const directory = await this.existingDirectory(path);
    const baseName = slugify(originalName.slice(0, -extension.length || undefined), 80);
    let fileName = `${baseName}${extension}`;
    let counter = 1;
    while (existsSync(join(directory, fileName))) {
      fileName = `${baseName}-${counter++}${extension}`;
    }

    const absolute = join(directory, fileName);
    await writeFile(absolute, file.buffer);
    return {
      name: fileName,
      url: this.toPublicPath(absolute),
      size: file.size,
      kind: kindOf(fileName),
      modifiedAt: new Date(),
    };
  }

  async removeFile(path: string) {
    const absolute = this.resolveSafe(path);
    const info = await stat(absolute).catch(() => null);
    if (!info?.isFile()) throw new NotFoundException('Fayl topilmadi');
    await unlink(absolute);
  }

  async createFolder(path: string | undefined, folderName: string) {
    const directory = await this.existingDirectory(path);
    const target = join(directory, folderName);
    if (existsSync(target)) throw new ConflictException('Bunday nomli papka allaqachon mavjud');
    await mkdir(target);
    return { folders: [folderName] };
  }

  async renameFolder(path: string | undefined, oldName: string, newName: string) {
    const directory = await this.existingDirectory(path);
    const source = this.resolveSafe(this.toPublicPath(join(directory, oldName)));
    const target = join(directory, newName);

    const info = await stat(source).catch(() => null);
    if (!info?.isDirectory()) throw new NotFoundException('Papka topilmadi');
    if (existsSync(target)) throw new ConflictException('Bunday nomli papka allaqachon mavjud');
    await rename(source, target);
  }

  async removeFolder(path: string) {
    const absolute = this.resolveSafe(path);
    if (absolute === this.root) throw new BadRequestException('Asosiy papkani o‘chirib bo‘lmaydi');
    const info = await stat(absolute).catch(() => null);
    if (!info?.isDirectory()) throw new NotFoundException('Papka topilmadi');
    await rm(absolute, { recursive: true, force: true });
  }

  async countFiles(directory = this.root): Promise<number> {
    const entries = await readdir(directory, { withFileTypes: true }).catch(() => []);
    let total = 0;
    for (const entry of entries) {
      if (entry.name.startsWith('.')) continue;
      if (entry.isDirectory()) total += await this.countFiles(join(directory, entry.name));
      else total += 1;
    }
    return total;
  }

  private async existingDirectory(path?: string) {
    const absolute = this.resolveSafe(path);
    const info = await stat(absolute).catch(() => null);
    if (!info?.isDirectory()) throw new NotFoundException('Papka topilmadi');
    return absolute;
  }

  private resolveSafe(path?: string) {
    const cleaned = (path ?? '').replace(/\\/g, '/').replace(/^\/+/, '');
    if (cleaned.split('/').some((segment) => segment === '..')) {
      throw new BadRequestException('Noto‘g‘ri yo‘l ko‘rsatildi');
    }
    const absolute = resolve(this.root, cleaned);
    if (absolute !== this.root && !absolute.startsWith(this.root + sep)) {
      throw new BadRequestException('Noto‘g‘ri yo‘l ko‘rsatildi');
    }
    return absolute;
  }

  private toPublicPath(absolute: string) {
    return relative(this.root, absolute).split(sep).join('/');
  }
}
