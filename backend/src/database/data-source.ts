import 'reflect-metadata';
import { config } from 'dotenv';
import { DataSource, DataSourceOptions } from 'typeorm';
import fs from 'fs';

config();

export const dataSourceOptions: DataSourceOptions = {
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT ?? 5432),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/../**/*.entity{.ts,.js}'],
  migrations: [__dirname + '/migrations/*{.ts,.js}'],
  synchronize: false,
  ssl:
    process.env.DB_SSL === 'true'
      ? {
          rejectUnauthorized: false,
          ca: process.env.DB_SSL_CA_PATH
            ? fs.readFileSync(process.env.DB_SSL_CA_PATH)
            : undefined,
        }
      : false,
};

export default new DataSource(dataSourceOptions);
