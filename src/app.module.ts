import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AuthModule } from './modules/auth/auth.module';
import { UserModule } from './modules/user/user.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { config } from './database/orm.config';
import { PassportModule } from '@nestjs/passport';
import { AppController } from './app.controller';

import { RequestLoggerMiddleware } from './middleware/request-logger';

//import module here
@Module({
  imports: [
    AuthModule,
    UserModule,
    ProductModule,
    OrderModule,
    TypeOrmModule.forRoot(config),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    PassportModule.register({ session: true }),
  ],
  controllers: [AppController],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer): void {
    consumer.apply(RequestLoggerMiddleware).forRoutes('*');
  }
}

//ConfigModule.forRoot({}) /*Loading Dotenv into app  */,
