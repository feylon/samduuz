# SamDU.uz — Samarqand davlat universiteti rasmiy sayti

Sharof Rashidov nomidagi Samarqand davlat universitetining rasmiy veb-sayti va kontentni boshqarish paneli.
Sayt to‘rt tilda ishlaydi: **o‘zbekcha (lotin)**, **ўзбекча (кирилл)**, **русский** va **English**.

| Qism | Texnologiyalar |
|------|----------------|
| Frontend | Nuxt 4, Vue 3, Nuxt UI 4, Tailwind CSS 4, @nuxtjs/i18n |
| Backend | NestJS 11, TypeORM, PostgreSQL 16, JWT, Swagger |
| Infratuzilma | Docker, Docker Compose |

---

## Imkoniyatlar

**Ommaviy sayt**
- Bosh sahifa: slayder, tezkor havolalar, so‘nggi yangiliklar va e’lonlar, statistika, hamkor saytlar
- Yangiliklar va e’lonlar: qidiruv, sahifalash, o‘xshash materiallar, ulashish, yoqtirish
- Dinamik sahifalar uch turda: oddiy matnli sahifa, rahbar sahifasi va kafedra sahifasi
- 3 darajali menyu (desktopda ochiladigan menyu, mobilda yon panel)
- Yorug‘ va tungi rejim, barcha ekran o‘lchamlari uchun moslashuvchan dizayn

**SEO**
- Barcha materiallar `slug` orqali ochiladi: `/news/xalqaro-ilmiy-konferensiya`, `/ru/pages/universitet-tarixi`
- Slug o‘zbekcha sarlavhadan avtomatik yaratiladi (kirill harflari lotinga o‘giriladi), kerak bo‘lsa qo‘lda ham beriladi
- Har bir tilning alohida URL manzili, `hreflang`, `canonical`, Open Graph va Twitter Card teglari
- Schema.org strukturaviy ma’lumotlari: `CollegeOrUniversity`, `NewsArticle`, `BreadcrumbList`, `Person`
- Barcha tillardagi sahifalarni o‘z ichiga olgan `/sitemap.xml` va `/robots.txt`
- Server tomonda render (SSR), admin panel esa qidiruv tizimlaridan yopilgan

**Admin panel** (`/admin`)
- Statistika paneli, yangiliklar, e’lonlar, sahifalar, menyu, slaydlar, foydali havolalar
- Matn muharriri (rasm qo‘shish fayl menejeri orqali)
- Fayl menejeri: papkalar, bir nechta faylni yuklash, sudrab tashlash
- Rejalashtirilgan nashr (kelajakdagi sana), qoralama holati
- Access/refresh token bilan avtomatik sessiya uzaytirish

**API**
- Swagger hujjatlari: har bir endpoint uchun barcha javob kodlari (200, 201, 400, 401, 404, 409, 413, 429, 500) va namunaviy javoblar
- Yagona javob formati, o‘zbek tilidagi xatolik xabarlari
- So‘rovlar sonini cheklash, Helmet, gzip, soft delete

---

## Loyiha tuzilmasi

```
samduuz/
├── backend/                 NestJS API
│   ├── src/
│   │   ├── common/          dekoratorlar, filtrlar, interceptor, yordamchi funksiyalar
│   │   ├── config/          muhit o‘zgaruvchilarini tekshirish
│   │   ├── database/        TypeORM sozlamalari, migratsiyalar, seed
│   │   └── modules/         auth, users, pages, news, announcements, slides,
│   │                        menus, useful-links, files, stats, seo, health
│   ├── uploads/             yuklangan fayllar
│   ├── Dockerfile
│   └── .env
├── frontend/                Nuxt ilova
│   ├── app/
│   │   ├── components/      site, home, content, page-views, admin
│   │   ├── composables/     API, auth, SEO, media
│   │   ├── layouts/         default (sayt) va admin
│   │   └── pages/           ommaviy sahifalar va /admin
│   ├── i18n/locales/        uz, kr, ru, en tarjimalari
│   ├── server/routes/       sitemap.xml, robots.txt
│   ├── Dockerfile
│   └── .env
├── docker-compose.yml
└── .env                     Docker Compose o‘zgaruvchilari
```

---

## 1-usul. Docker orqali ishga tushirish (tavsiya etiladi)

### Talablar
- Docker 24+ va Docker Compose v2

### Qadamlar

```bash
git clone git@github.com:feylon/samduuz.git
cd samduuz

docker compose up -d --build
```

Birinchi ishga tushishda backend avtomatik ravishda:
1. ma’lumotlar bazasi migratsiyalarini bajaradi;
2. admin foydalanuvchini yaratadi;
3. namunaviy kontent qo‘shadi (`SEED_DEMO=false` qilinsa qo‘shilmaydi).

Konteynerlar holatini tekshirish:

```bash
docker compose ps
docker compose logs -f backend
```

### Manzillar

| Xizmat | Manzil |
|--------|--------|
| Sayt | http://localhost:3000 |
| Admin panel | http://localhost:3000/admin |
| API | http://localhost:5454/api |
| Swagger | http://localhost:5454/docs |
| Swagger JSON | http://localhost:5454/docs/json |
| PostgreSQL | `localhost:5433` |

**Admin uchun kirish ma’lumotlari:** login `admin`, parol `Admin12345`
(root `.env` faylidagi `ADMIN_USERNAME` / `ADMIN_PASSWORD`). Tizimga kirgach parolni
chap pastdagi foydalanuvchi menyusidan *Parolni o‘zgartirish* bo‘limida almashtiring.

### Foydali buyruqlar

```bash
docker compose down                 # to‘xtatish
docker compose down -v              # bazani va yuklangan fayllarni ham o‘chirish
docker compose up -d --build backend   # faqat backendni qayta yig‘ish
docker compose exec postgres psql -U samdu -d samdu_db
```

### Root `.env` o‘zgaruvchilari

| O‘zgaruvchi | Tavsif | Standart qiymat |
|-------------|--------|-----------------|
| `POSTGRES_USER` / `POSTGRES_PASSWORD` / `POSTGRES_DB` | Baza ma’lumotlari | `samdu` / `samdu_secret_2026` / `samdu_db` |
| `POSTGRES_PORT` | Bazaning tashqi porti | `5433` |
| `BACKEND_PORT` / `FRONTEND_PORT` | Tashqi portlar | `5454` / `3000` |
| `PUBLIC_API_URL` | Brauzer murojaat qiladigan API manzili | `http://localhost:5454/api` |
| `PUBLIC_UPLOADS_URL` | Yuklangan fayllar manzili | `http://localhost:5454/uploads` |
| `PUBLIC_SITE_URL` | Saytning asosiy manzili (canonical, sitemap) | `http://localhost:3000` |
| `JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET` | Token kalitlari | — |
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | Birinchi admin | `admin` / `Admin12345` |
| `SEED_DEMO` | Namunaviy kontent qo‘shish | `true` |

> Serverga joylashda `PUBLIC_*` manzillarni haqiqiy domenlarga (masalan `https://samdu.uz`,
> `https://api.samdu.uz/api`) va JWT kalitlarini uzun tasodifiy qiymatlarga almashtiring.

---

## 2-usul. Lokal ishlab chiqish muhitida ishga tushirish

### Talablar
- Node.js 22+ va npm 10+
- PostgreSQL 16 (yoki faqat bazani Docker orqali ko‘tarish mumkin)

### 1. Ma’lumotlar bazasi

```bash
docker compose up -d postgres
```

Agar o‘zingizning PostgreSQL serveringizdan foydalansangiz, `backend/.env` dagi
`DB_HOST`, `DB_PORT`, `DB_USER`, `DB_PASSWORD`, `DB_NAME` qiymatlarini moslang.

### 2. Backend

```bash
cd backend
npm install
npm run seed          # migratsiyalar + admin + namunaviy kontent
npm run start:dev     # http://localhost:5454/api, Swagger: http://localhost:5454/docs
```

Backend skriptlari:

| Buyruq | Vazifasi |
|--------|----------|
| `npm run start:dev` | Kuzatuv rejimida ishga tushirish |
| `npm run build` / `npm run start:prod` | Production build va ishga tushirish |
| `npm run seed` | Migratsiya, admin va namunaviy kontent |
| `npm run migration:generate src/database/migrations/Nomi` | Entity o‘zgarishlaridan migratsiya yaratish |
| `npm run migration:run` / `npm run migration:revert` | Migratsiyani bajarish / bekor qilish |
| `npm run lint` | ESLint tekshiruvi |

### 3. Frontend

```bash
cd frontend
npm install
npm run dev           # http://localhost:3000
```

Frontend skriptlari:

| Buyruq | Vazifasi |
|--------|----------|
| `npm run dev` | Ishlab chiqish serveri |
| `npm run build` / `npm run start` | Production build va ishga tushirish |
| `npm run lint` | ESLint tekshiruvi |
| `npm run typecheck` | TypeScript tekshiruvi |

### `backend/.env`

| O‘zgaruvchi | Tavsif |
|-------------|--------|
| `APP_PORT` | API porti (`5454`) |
| `CORS_ORIGINS` | Ruxsat etilgan frontend manzillari, vergul bilan |
| `DB_*` | PostgreSQL ulanishi |
| `JWT_ACCESS_SECRET`, `JWT_ACCESS_EXPIRES` | Access token kaliti va muddati (`1h`) |
| `JWT_REFRESH_SECRET`, `JWT_REFRESH_EXPIRES` | Refresh token kaliti va muddati (`7d`) |
| `ADMIN_USERNAME`, `ADMIN_PASSWORD`, `ADMIN_FULL_NAME` | Seed yaratadigan admin |
| `UPLOAD_DIR`, `UPLOAD_MAX_SIZE_MB` | Fayllar papkasi va maksimal hajm |

### `frontend/.env`

| O‘zgaruvchi | Tavsif |
|-------------|--------|
| `NUXT_PUBLIC_API_BASE` | Brauzerdan API manzili |
| `NUXT_API_INTERNAL` | SSR paytida server ichidan API manzili |
| `NUXT_PUBLIC_UPLOADS_BASE` | Yuklangan fayllar manzili |
| `NUXT_PUBLIC_SITE_URL`, `NUXT_PUBLIC_I18N_BASE_URL` | Saytning to‘liq manzili |

---

## API haqida qisqacha

Barcha javoblar bir xil formatda qaytadi:

```json
{
  "success": true,
  "statusCode": 200,
  "message": "Muvaffaqiyatli bajarildi",
  "data": {},
  "errors": []
}
```

Xatolik bo‘lganda:

```json
{
  "success": false,
  "statusCode": 400,
  "message": "Validatsiya xatoligi",
  "data": null,
  "errors": [{ "field": "titleUz", "message": "titleUz bo‘sh bo‘lmasligi kerak" }],
  "path": "/api/news",
  "timestamp": "2026-04-12T09:30:00.000Z"
}
```

- Ommaviy endpointlar tilni `Accept-Language` sarlavhasi (`uz`, `kr`, `ru`, `en`) yoki `?lang=` orqali qabul qiladi.
- Admin endpointlari `Authorization: Bearer <accessToken>` talab qiladi; token `POST /api/auth/login` orqali olinadi.
- Ro‘yxatlar `?page=1&pageSize=10&search=...` parametrlari bilan sahifalanadi.
- To‘liq hujjat: http://localhost:5454/docs

## Litsenziya

[MIT](./LICENSE)
