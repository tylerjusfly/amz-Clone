import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../product/entity/product.entity';
import { OrderDto } from './order.dto';
import { OrderEntity } from './entity/order.entity';
import { OrderTrackerId } from 'src/common/utils';
import { CartEntity } from '../cart/cart.entity';

@Injectable()
export class OrderService {
  //create constructor
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    @InjectRepository(CartEntity) private cartRepository: Repository<CartEntity>,
  ) {}

  async CreateOrder(orderDto: OrderDto) {
    const createOrder = {
      owner: '3',
      products: orderDto.products,
    };
    const OrdertrackingId = OrderTrackerId();

    // create and save Order
    const { id } = await this.orderRepository.save({
      orderId: OrdertrackingId,
      cart: createOrder.products,
      address: orderDto.address,
      userId: createOrder.owner,
      updated: new Date(),
    });

    //send products to cart

    //let order = await this.orderRepository.findOneBy({ id: id });

    let order = await this.orderRepository.findOne({
      where: {
        id: id,
      },
      relations: {
        cart: true,
      },
    });

    // const ids = order.cart.map((value) => value.product);

    // const products = await this.productRepository.findBy({ id: In(ids) });

    // const totalPrice = order.products.reduce((acc, product) => {
    //   const price = product.product.price * product.quantity;
    //   return acc + price;
    // }, 0);

    //let ids = orderDto.products.map((value) => value.product);

    //return ids;
    return { order };
  }
}
