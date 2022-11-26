import { Module } from '@nestjs/common';
import { OrderController } from './order.controller';
import { OrderService } from './order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Product } from '../product/entity/product.entity';
import { OrderEntity } from './entity/order.entity';
import { CartEntity } from '../cart/cart.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Product, OrderEntity, CartEntity])],
  controllers: [OrderController],
  providers: [OrderService],
})
export class OrderModule {}
