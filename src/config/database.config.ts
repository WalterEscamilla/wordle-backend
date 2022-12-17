import 'dotenv/config';
import { DataSourceOptions } from 'typeorm';

const databaseConfig: DataSourceOptions = {
  name: 'postgres',
  type: 'postgres',
  database: process.env.DB_NAME,
  synchronize: false,
  logging: true,
  host: "localhost",
  port: 5432,
  username: "postgres",
  password: "root",
  entities: ['**/**.entity.ts'],
  subscribers: [],
  migrations: ['src/migrations/*.ts'],
  migrationsRun: false
};

export default databaseConfig;