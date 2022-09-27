import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ProductModule } from './product/product.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './orm.config';

//import module here
@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
  ],
})
export class AppModule {}

//global file similar to react where we have app.js , main.js

//ConfigModule.forRoot({}) /*Loading Dotenv into app  */,
