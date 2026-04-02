import { DataSourceOptions } from 'typeorm';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { join } from 'path';

export const buildDataSourceOptions = (env: NodeJS.ProcessEnv): DataSourceOptions => ({
  type: 'postgres',
  host: env.DB_HOST,
  port: Number(env.DB_PORT ?? 5432),
  username: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  logging: env.DB_LOGGING === 'true',
  namingStrategy: new SnakeNamingStrategy(),
  entities: [join(__dirname, '..', '**', '*.entity.{ts,js}')],
  migrations: [join(__dirname, 'migrations', '*.{ts,js}')],
  migrationsTableName: 'migrations',
  synchronize: false,
});
