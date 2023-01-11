import "reflect-metadata"
import { DataSource,DataSourceOptions } from "typeorm"


let dbConnect;
export async function setupTestDb() {

    dbConnect = new DataSource({
        name: 'postgres',
        type: 'postgres',
        database: process.env.DB_NAME_TEST,
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
    } as DataSourceOptions);
    await dbConnect.initialize()
}

export async function closeTestDb() {
    await  dbConnect.destroy();
}