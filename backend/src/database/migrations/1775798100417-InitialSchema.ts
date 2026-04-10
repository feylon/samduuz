import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSchema1775798100417 implements MigrationInterface {
  name = 'InitialSchema1775798100417';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'editor')`);
    await queryRunner.query(
      `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "username" character varying(64) NOT NULL, "password_hash" character varying NOT NULL, "full_name" character varying(150) NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'editor', "is_active" boolean NOT NULL DEFAULT true, "refresh_token_hash" character varying, "last_login_at" TIMESTAMP WITH TIME ZONE, CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "IDX_fe0bb3f6520ee0469504521e71" ON "users" ("username") `,
    );
    await queryRunner.query(
      `CREATE TABLE "pages" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "page_type" smallint NOT NULL DEFAULT '0', "slug" character varying(160) NOT NULL, "title_uz" character varying(255) NOT NULL, "title_kr" character varying(255) NOT NULL DEFAULT '', "title_ru" character varying(255) NOT NULL DEFAULT '', "title_en" character varying(255) NOT NULL DEFAULT '', "content_uz" text NOT NULL DEFAULT '', "content_kr" text NOT NULL DEFAULT '', "content_ru" text NOT NULL DEFAULT '', "content_en" text NOT NULL DEFAULT '', "is_published" boolean NOT NULL DEFAULT true, "views" integer NOT NULL DEFAULT '0', "owner_id" integer, CONSTRAINT "PK_8f21ed625aa34c8391d636b7d3b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_pages_slug" ON "pages" ("slug") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "slides" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "title_uz" character varying(255) NOT NULL, "title_kr" character varying(255) NOT NULL DEFAULT '', "title_ru" character varying(255) NOT NULL DEFAULT '', "title_en" character varying(255) NOT NULL DEFAULT '', "description_uz" character varying(500) NOT NULL DEFAULT '', "description_kr" character varying(500) NOT NULL DEFAULT '', "description_ru" character varying(500) NOT NULL DEFAULT '', "description_en" character varying(500) NOT NULL DEFAULT '', "main_image_path" character varying(500) NOT NULL, "external_link" character varying(500), "is_active" boolean NOT NULL DEFAULT true, "priority" integer NOT NULL DEFAULT '1', "related_page_id" integer, "owner_id" integer, CONSTRAINT "PK_7907bb06ab78980c123912f7a7a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "news" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "slug" character varying(160) NOT NULL, "title_uz" character varying(255) NOT NULL, "title_kr" character varying(255) NOT NULL DEFAULT '', "title_ru" character varying(255) NOT NULL DEFAULT '', "title_en" character varying(255) NOT NULL DEFAULT '', "description_uz" character varying(500) NOT NULL DEFAULT '', "description_kr" character varying(500) NOT NULL DEFAULT '', "description_ru" character varying(500) NOT NULL DEFAULT '', "description_en" character varying(500) NOT NULL DEFAULT '', "content_uz" text NOT NULL DEFAULT '', "content_kr" text NOT NULL DEFAULT '', "content_ru" text NOT NULL DEFAULT '', "content_en" text NOT NULL DEFAULT '', "main_image_path" character varying(500) NOT NULL DEFAULT '', "views" integer NOT NULL DEFAULT '0', "likes" integer NOT NULL DEFAULT '0', "is_published" boolean NOT NULL DEFAULT true, "published_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "owner_id" integer, CONSTRAINT "PK_39a43dfcb6007180f04aff2357e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_news_published" ON "news" ("is_published", "published_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_news_slug" ON "news" ("slug") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "menus" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name_uz" character varying(150) NOT NULL, "name_kr" character varying(150) NOT NULL DEFAULT '', "name_ru" character varying(150) NOT NULL DEFAULT '', "name_en" character varying(150) NOT NULL DEFAULT '', "priority" integer NOT NULL DEFAULT '1', "parent_id" integer, "related_page_id" integer, "external_link" character varying(500), "owner_id" integer, CONSTRAINT "PK_3fec3d93327f4538e0cbd4349c4" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "announcements" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "slug" character varying(160) NOT NULL, "title_uz" character varying(255) NOT NULL, "title_kr" character varying(255) NOT NULL DEFAULT '', "title_ru" character varying(255) NOT NULL DEFAULT '', "title_en" character varying(255) NOT NULL DEFAULT '', "description_uz" character varying(500) NOT NULL DEFAULT '', "description_kr" character varying(500) NOT NULL DEFAULT '', "description_ru" character varying(500) NOT NULL DEFAULT '', "description_en" character varying(500) NOT NULL DEFAULT '', "content_uz" text NOT NULL DEFAULT '', "content_kr" text NOT NULL DEFAULT '', "content_ru" text NOT NULL DEFAULT '', "content_en" text NOT NULL DEFAULT '', "main_image_path" character varying(500) NOT NULL DEFAULT '', "views" integer NOT NULL DEFAULT '0', "likes" integer NOT NULL DEFAULT '0', "is_published" boolean NOT NULL DEFAULT true, "published_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "owner_id" integer, CONSTRAINT "PK_b3ad760876ff2e19d58e05dc8b0" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_announcements_published" ON "announcements" ("is_published", "published_at") `,
    );
    await queryRunner.query(
      `CREATE UNIQUE INDEX "UQ_announcements_slug" ON "announcements" ("slug") WHERE "deleted_at" IS NULL`,
    );
    await queryRunner.query(
      `CREATE TABLE "useful_links" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "updated_at" TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP WITH TIME ZONE, "name_uz" character varying(255) NOT NULL, "name_kr" character varying(255) NOT NULL DEFAULT '', "name_ru" character varying(255) NOT NULL DEFAULT '', "name_en" character varying(255) NOT NULL DEFAULT '', "external_link" character varying(500) NOT NULL, "image_path" character varying(500) NOT NULL, "priority" integer NOT NULL DEFAULT '1', "is_active" boolean NOT NULL DEFAULT true, "owner_id" integer, CONSTRAINT "PK_d78a8d61586e1cc5efee1e1d7f3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "pages" ADD CONSTRAINT "FK_61b082ecb942e089efb1a9cd570" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "slides" ADD CONSTRAINT "FK_7ff857235b687c7cac9825c7fb1" FOREIGN KEY ("related_page_id") REFERENCES "pages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "slides" ADD CONSTRAINT "FK_eff1ce1a66a707289ee524a963b" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "news" ADD CONSTRAINT "FK_f2f642257084b8c00e0c270f5e6" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD CONSTRAINT "FK_00ccc1ed4e9fc23bc1246269359" FOREIGN KEY ("parent_id") REFERENCES "menus"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD CONSTRAINT "FK_52de2d6f6635cd6383be4211524" FOREIGN KEY ("related_page_id") REFERENCES "pages"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "menus" ADD CONSTRAINT "FK_53db73b25c985a1f7864b62064d" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "announcements" ADD CONSTRAINT "FK_5828fcee278251ff29e85d4885a" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "useful_links" ADD CONSTRAINT "FK_f6d6b4285989a8fe70be76c05e4" FOREIGN KEY ("owner_id") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "useful_links" DROP CONSTRAINT "FK_f6d6b4285989a8fe70be76c05e4"`,
    );
    await queryRunner.query(
      `ALTER TABLE "announcements" DROP CONSTRAINT "FK_5828fcee278251ff29e85d4885a"`,
    );
    await queryRunner.query(`ALTER TABLE "menus" DROP CONSTRAINT "FK_53db73b25c985a1f7864b62064d"`);
    await queryRunner.query(`ALTER TABLE "menus" DROP CONSTRAINT "FK_52de2d6f6635cd6383be4211524"`);
    await queryRunner.query(`ALTER TABLE "menus" DROP CONSTRAINT "FK_00ccc1ed4e9fc23bc1246269359"`);
    await queryRunner.query(`ALTER TABLE "news" DROP CONSTRAINT "FK_f2f642257084b8c00e0c270f5e6"`);
    await queryRunner.query(
      `ALTER TABLE "slides" DROP CONSTRAINT "FK_eff1ce1a66a707289ee524a963b"`,
    );
    await queryRunner.query(
      `ALTER TABLE "slides" DROP CONSTRAINT "FK_7ff857235b687c7cac9825c7fb1"`,
    );
    await queryRunner.query(`ALTER TABLE "pages" DROP CONSTRAINT "FK_61b082ecb942e089efb1a9cd570"`);
    await queryRunner.query(`DROP TABLE "useful_links"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_announcements_slug"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_announcements_published"`);
    await queryRunner.query(`DROP TABLE "announcements"`);
    await queryRunner.query(`DROP TABLE "menus"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_news_slug"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_news_published"`);
    await queryRunner.query(`DROP TABLE "news"`);
    await queryRunner.query(`DROP TABLE "slides"`);
    await queryRunner.query(`DROP INDEX "public"."UQ_pages_slug"`);
    await queryRunner.query(`DROP TABLE "pages"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_fe0bb3f6520ee0469504521e71"`);
    await queryRunner.query(`DROP TABLE "users"`);
    await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
  }
}
