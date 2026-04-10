import 'reflect-metadata';
import * as bcrypt from 'bcryptjs';
import { config } from 'dotenv';
import { copyFile, mkdir, readdir } from 'fs/promises';
import { join, resolve } from 'path';
import { DataSource } from 'typeorm';
import { UserRole } from '../../common/enums/user-role.enum';
import { slugify } from '../../common/utils/slugify';
import { Announcement } from '../../modules/announcements/entities/announcement.entity';
import { Menu } from '../../modules/menus/entities/menu.entity';
import { News } from '../../modules/news/entities/news.entity';
import { Page } from '../../modules/pages/entities/page.entity';
import { Slide } from '../../modules/slides/entities/slide.entity';
import { UsefulLink } from '../../modules/useful-links/entities/useful-link.entity';
import { User } from '../../modules/users/entities/user.entity';
import { buildDataSourceOptions } from '../typeorm.config';
import { demoAnnouncements, demoNews, demoPages, paragraphs } from './demo-content';

config();

const DAY = 24 * 60 * 60 * 1000;

const copyDemoAssets = async () => {
  const target = resolve(process.env.UPLOAD_DIR ?? 'uploads', 'demo');
  await mkdir(target, { recursive: true });
  const source = join(__dirname, 'assets');
  const files = await readdir(source).catch(() => [] as string[]);
  await Promise.all(files.map((file) => copyFile(join(source, file), join(target, file))));
};

const seedAdmin = async (dataSource: DataSource) => {
  const users = dataSource.getRepository(User);
  const username = process.env.ADMIN_USERNAME ?? 'admin';
  let admin = await users.findOne({ where: { username } });
  if (admin) return admin;

  admin = await users.save(
    users.create({
      username,
      fullName: process.env.ADMIN_FULL_NAME ?? 'Administrator',
      role: UserRole.Admin,
      passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD ?? 'Admin12345', 10),
    }),
  );
  console.log(`Admin yaratildi: ${username}`);
  return admin;
};

const seedContent = async (dataSource: DataSource, ownerId: number) => {
  const hasContent = await dataSource.getRepository(News).exists();
  if (hasContent) {
    console.log('Namunaviy kontent allaqachon mavjud, o‘tkazib yuborildi');
    return;
  }

  await copyDemoAssets();
  const pageRepository = dataSource.getRepository(Page);
  const pages: Record<string, Page> = {};

  for (const item of demoPages) {
    const { key, employee, department, ...rest } = item as (typeof demoPages)[number] & {
      employee?: Record<string, string>;
      department?: Record<string, string>;
    };
    const details = employee ?? department;
    const content = details
      ? {
          contentUz: JSON.stringify(details),
          contentKr: JSON.stringify(details),
          contentRu: JSON.stringify(details),
          contentEn: JSON.stringify(details),
        }
      : {};
    pages[key] = await pageRepository.save(
      pageRepository.create({ ...rest, ...content, slug: slugify(rest.titleUz), ownerId }),
    );
  }

  const now = Date.now();
  await dataSource.getRepository(News).save(
    demoNews.map((item, index) => ({
      ...item,
      slug: slugify(item.titleUz),
      contentUz: paragraphs.Uz,
      contentKr: paragraphs.Kr,
      contentRu: paragraphs.Ru,
      contentEn: paragraphs.En,
      mainImagePath: `demo/cover-${(index % 8) + 1}.webp`,
      publishedAt: new Date(now - index * 2 * DAY),
      views: 40 + index * 17,
      ownerId,
    })),
  );

  await dataSource.getRepository(Announcement).save(
    demoAnnouncements.map((item, index) => ({
      ...item,
      slug: slugify(item.titleUz),
      contentUz: paragraphs.Uz,
      contentKr: paragraphs.Kr,
      contentRu: paragraphs.Ru,
      contentEn: paragraphs.En,
      mainImagePath: `demo/cover-${8 - (index % 8)}.webp`,
      publishedAt: new Date(now - index * 3 * DAY),
      ownerId,
    })),
  );

  await dataSource.getRepository(Slide).save([
    {
      titleUz: 'Bilim, ilm va kelajak shu yerda boshlanadi',
      titleKr: 'Билим, илм ва келажак шу ерда бошланади',
      titleRu: 'Знания, наука и будущее начинаются здесь',
      titleEn: 'Knowledge, science and the future start here',
      descriptionUz: 'Markaziy Osiyodagi eng qadimiy universitetlardan biri — 1927-yildan buyon.',
      descriptionKr: 'Марказий Осиёдаги энг қадимий университетлардан бири — 1927 йилдан буён.',
      descriptionRu: 'Один из старейших университетов Центральной Азии — с 1927 года.',
      descriptionEn: 'One of the oldest universities in Central Asia — since 1927.',
      mainImagePath: 'demo/cover-1.webp',
      relatedPageId: pages.history.id,
      priority: 1,
      ownerId,
    },
    {
      titleUz: 'Qabul-2026: o‘z yo‘nalishingizni tanlang',
      titleKr: 'Қабул-2026: ўз йўналишингизни танланг',
      titleRu: 'Приём-2026: выберите своё направление',
      titleEn: 'Admission 2026: choose your programme',
      descriptionUz: '76 ta bakalavriat va 60 dan ortiq magistratura mutaxassisliklari.',
      descriptionKr: '76 та бакалавриат ва 60 дан ортиқ магистратура мутахассисликлари.',
      descriptionRu: '76 направлений бакалавриата и более 60 специальностей магистратуры.',
      descriptionEn: '76 bachelor programmes and over 60 master’s specialisations.',
      mainImagePath: 'demo/cover-2.webp',
      externalLink: 'https://qabul.samdu.uz',
      priority: 2,
      ownerId,
    },
  ]);

  const menuRepository = dataSource.getRepository(Menu);
  const university = await menuRepository.save({
    nameUz: 'Universitet',
    nameKr: 'Университет',
    nameRu: 'Университет',
    nameEn: 'University',
    priority: 1,
    ownerId,
  });
  const activity = await menuRepository.save({
    nameUz: 'Faoliyat',
    nameKr: 'Фаолият',
    nameRu: 'Деятельность',
    nameEn: 'Activity',
    priority: 2,
    ownerId,
  });
  await menuRepository.save([
    {
      nameUz: 'Tarix',
      nameKr: 'Тарих',
      nameRu: 'История',
      nameEn: 'History',
      priority: 1,
      parentId: university.id,
      relatedPageId: pages.history.id,
      ownerId,
    },
    {
      nameUz: 'Rahbariyat',
      nameKr: 'Раҳбарият',
      nameRu: 'Руководство',
      nameEn: 'Leadership',
      priority: 2,
      parentId: university.id,
      relatedPageId: pages.rector.id,
      ownerId,
    },
    {
      nameUz: 'Kafedralar',
      nameKr: 'Кафедралар',
      nameRu: 'Кафедры',
      nameEn: 'Departments',
      priority: 3,
      parentId: university.id,
      relatedPageId: pages.department.id,
      ownerId,
    },
    {
      nameUz: 'Yangiliklar',
      nameKr: 'Янгиликлар',
      nameRu: 'Новости',
      nameEn: 'News',
      priority: 1,
      parentId: activity.id,
      externalLink: '/news',
      ownerId,
    },
    {
      nameUz: 'E’lonlar',
      nameKr: 'Эълонлар',
      nameRu: 'Объявления',
      nameEn: 'Announcements',
      priority: 2,
      parentId: activity.id,
      externalLink: '/announcements',
      ownerId,
    },
    {
      nameUz: 'Talabalar',
      nameKr: 'Талабалар',
      nameRu: 'Студентам',
      nameEn: 'Students',
      priority: 3,
      externalLink: 'https://hemis.samdu.uz',
      ownerId,
    },
    {
      nameUz: 'Bog‘lanish',
      nameKr: 'Боғланиш',
      nameRu: 'Контакты',
      nameEn: 'Contacts',
      priority: 4,
      relatedPageId: pages.contacts.id,
      ownerId,
    },
  ]);

  await dataSource.getRepository(UsefulLink).save([
    {
      nameUz: 'O‘zbekiston Respublikasi Prezidentining rasmiy sayti',
      nameKr: 'Ўзбекистон Республикаси Президентининг расмий сайти',
      nameRu: 'Официальный сайт Президента Республики Узбекистан',
      nameEn: 'Official website of the President of Uzbekistan',
      externalLink: 'https://president.uz',
      imagePath: 'demo/gerb.jpg',
      priority: 1,
      ownerId,
    },
    {
      nameUz: 'Oliy ta’lim, fan va innovatsiyalar vazirligi',
      nameKr: 'Олий таълим, фан ва инновациялар вазирлиги',
      nameRu: 'Министерство высшего образования, науки и инноваций',
      nameEn: 'Ministry of Higher Education, Science and Innovation',
      externalLink: 'https://edu.uz',
      imagePath: 'demo/gerb.jpg',
      priority: 2,
      ownerId,
    },
    {
      nameUz: 'Hukumat portali',
      nameKr: 'Ҳукумат портали',
      nameRu: 'Правительственный портал',
      nameEn: 'Government portal',
      externalLink: 'https://gov.uz',
      imagePath: 'demo/gerb.jpg',
      priority: 3,
      ownerId,
    },
    {
      nameUz: 'Yagona interaktiv davlat xizmatlari portali',
      nameKr: 'Ягона интерактив давлат хизматлари портали',
      nameRu: 'Единый портал интерактивных госуслуг',
      nameEn: 'Single portal of public services',
      externalLink: 'https://my.gov.uz',
      imagePath: 'demo/mygov.png',
      priority: 4,
      ownerId,
    },
    {
      nameUz: 'O‘zbekiston Milliy axborot agentligi',
      nameKr: 'Ўзбекистон Миллий ахборот агентлиги',
      nameRu: 'Национальное информационное агентство Узбекистана',
      nameEn: 'National News Agency of Uzbekistan',
      externalLink: 'https://uza.uz',
      imagePath: 'demo/uza.png',
      priority: 5,
      ownerId,
    },
  ]);

  console.log('Namunaviy kontent qo‘shildi');
};

const run = async () => {
  const dataSource = new DataSource(buildDataSourceOptions(process.env));
  await dataSource.initialize();
  await dataSource.runMigrations();

  const admin = await seedAdmin(dataSource);
  if (process.env.SEED_DEMO !== 'false') await seedContent(dataSource, admin.id);

  await dataSource.destroy();
};

run().catch((error) => {
  console.error('Seed bajarilmadi:', error);
  process.exit(1);
});
