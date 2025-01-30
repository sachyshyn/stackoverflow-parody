import { DataSource } from 'typeorm';
import { config } from 'dotenv';

config();
console.log(process.env.DATABASE_PORT);
export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DATABASE_HOST,
  port: Number(process.env.DATABASE_PORT),
  username: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  synchronize: false,
  entities: ['"src/modules/**/*.entity{.ts,.js}'],
  migrations: ['src/migrations/**'],
  subscribers: ['src/subscribers/*.ts'],
});
