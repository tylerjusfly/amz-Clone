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
    try {
      const createOrder = {
        owner: '3',
        products: orderDto.products,
      };
      const OrdertrackingId = OrderTrackerId();

      //Get ids of all produts
      const ids = createOrder.products.map((value) => value.productId);

      const products = await this.productRepository.findBy({ id: In(ids) });

      //Mapping multiple objects into one object
      let carts = createOrder.products.map((order, i) => {
        let temp = products.find((element) => element.id === +order.productId);

        if (temp.id) {
          order.name = temp.name;
          order.price = temp.price;
          order.unitCount = temp.unitCount;
        }

        return order;
      });

      // create and save Order
      const { id } = await this.orderRepository.save({
        orderId: OrdertrackingId,
        cart: carts,
        address: orderDto.address,
        userId: createOrder.owner,
        updated: new Date(),
      });

      let order = await this.orderRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          cart: true,
        },
      });

      const totalPrice = order.cart.reduce((acc, product) => {
        const price = product.price * product.quantity;
        return acc + price;
      }, 0);

      order.totalPrice = Math.abs(totalPrice);

      return { type: 'Success', message: 'Order Created', order };
    } catch (error) {
      console.log(error);
      return { type: 'Error', message: error.message };
    }
  }
}
