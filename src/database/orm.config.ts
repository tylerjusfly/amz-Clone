import { TypeOrmModuleOptions } from '@nestjs/typeorm';

import { Env } from '../configuration/config';

export const config: TypeOrmModuleOptions = {
  type: 'postgres',
  username: process.env.DATABASE_USER,
  password: Env.DatabasePassword,
  port: 5432,
  host: process.env.DATABASE_HOST,
  database: process.env.DATABASE_DATABASE,
  // ssl: {
  //   require: true,
  //   rejectUnauthorized: false,
  // },
  synchronize: true,
  autoLoadEntities: true,
  entities: [__dirname + 'src/**/*.entity{ .ts,.js}'],
  migrations: [__dirname + '/**/'],
};
