import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Product } from '../product/entity/product.entity';
import { OrderDto } from './order.dto';
import { OrderEntity } from './entity/order.entity';
import { OrderTrackerId } from 'src/common/utils';
import { CartEntity } from '../cart/cart.entity';
import { PaginationInterface } from 'src/common/pagination.dto';

@Injectable()
export class OrderService {
  //create constructor
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(OrderEntity) private orderRepository: Repository<OrderEntity>,
    @InjectRepository(CartEntity) private cartRepository: Repository<CartEntity>,
  ) {}

  async fetchOrders(options: PaginationInterface, params) {
    try {
      const query = this.orderRepository.createQueryBuilder('q').leftJoinAndSelect('q.cart', 'cart');

      if (params.userid && params.userid !== '') {
        query.where('q.userId = :userid', { userid: params.userid });
      }

      const page = +options.page - 1;

      let orders = await query
        .offset(page * +options.limit)
        .limit(+options.limit)
        .orderBy('q.createdAt', 'DESC')
        .getMany();

      const total = await query.getCount();

      return {
        type: 'Success',
        orders,
        totalPages: Math.ceil(total / options.limit),
        itemsPerPage: options.limit,
        totalItems: total,
        currentPage: options.page,
      };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }

  async CreateOrder(orderDto: OrderDto) {
    try {
      const createOrder = {
        owner: '119',
        products: orderDto.products,
      };
      const OrdertrackingId = OrderTrackerId();

      //Get ids of all produts
      const ids = createOrder.products.map((value) => value.productId);

      const products = await this.productRepository.findBy({ id: In(ids) });

      if (products.length !== createOrder.products.length) {
        return { type: 'Error', message: 'Not all Products were found' };
      }

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

      // Getting order After saving Order
      let order = await this.orderRepository.findOne({
        where: {
          id: id,
        },
        relations: {
          cart: true,
        },
      });

      const totalPrice = order.cart.reduce((acc, product) => {
        const price = Math.abs(product.price) * product.quantity;
        return acc + price;
      }, 0);

      // return Math.abs(totalPrice);

      order.totalPrice = Math.abs(totalPrice);

      await this.orderRepository.save(order);

      return { type: 'Success', message: 'Order Created' };
    } catch (error) {
      console.log(error);
      return { type: 'Error', message: error.message };
    }
  }

  // Switch Order Status
  async SwitchOrderStatus(orderId: number, { orderStatus }) {
    try {
      let orderTypeArray = ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

      // if orderid is not specified || orderstatus is not specified
      if (!orderId || !orderStatus || !orderTypeArray.includes(orderStatus)) {
        return { type: 'Error', message: 'invalid data specified' };
      }
      // Find Order
      const order = await this.orderRepository.findOneBy({ id: orderId });

      if (!order) {
        return { type: 'Error', message: 'Order Not Found' };
      }

      order.status = orderStatus;
      order.updated = new Date();

      await this.orderRepository.save(order);

      return { type: 'Success', order };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }

  async switchPaymentStatus(orderId: number, paid: string) {
    try {
      if (!orderId || !paid) {
        return { type: 'Error', message: 'orderId or Paid Status is not specified' };
      }
      // Find the order
      const orderData = await this.orderRepository.findOneBy({ id: orderId });

      if (!orderData) {
        return { type: 'Error', message: 'Order Not Found' };
      }
      // change order payment status
      switch (paid) {
        case '1':
          orderData.paymentStatus = true;
          orderData.updated = new Date();
          break;
        default:
          orderData.paymentStatus = false;
          orderData.updated = new Date();
          break;
      }

      await this.orderRepository.save(orderData);

      return { type: 'Success', message: 'Payment status successfully Changed', orderData };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }
}
