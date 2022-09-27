import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { Auth } from './auth/auth.entity';
import { Product } from './product/product.entity';
require('dotenv').config();

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: 'postgres',
  password: process.env.DATABASE_PASS,
  port: 5432,
  host: '127.0.0.1',
  database: 'postgres',
  synchronize: true,
  entities: [Auth, Product],
};
