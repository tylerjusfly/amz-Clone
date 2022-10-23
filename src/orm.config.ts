import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Auth } from './auth/auth.entity';
import { Product } from './product/entity/product.entity';
import { Env } from './configuration/config';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env.DATABASE_USER,
  password: Env.DatabasePassword,
  port: 5432,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DATABASE,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
  synchronize: true,
  entities: [Auth, Product],
};
