import { DataSourceOptions } from 'typeorm';
        import 'dotenv/config';

        const dataSourceOptions: DataSourceOptions = {
            type: 'postgres',
            url: process.env.DATABASE_URL,
            entities: [__dirname + '/../**/*.entity{.ts,.js}'],
            migrations: [__dirname + '/../migrations/*{.ts,.js}'],
            synchronize: false,
            logging: process.env.NODE_ENV === 'development',
            extra: {
                ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
            }
        };

        export const config = {
            dataSourceOptions,
            // Outras configurações...
        };