import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository, DataSource } from 'typeorm';
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
    private dataSource: DataSource,
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
    const queryRunner = this.dataSource.createQueryRunner();

    // put it outside so its not be rolled back if an error occurs.
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      if (!orderId || !paid) {
        return { type: 'Error', message: 'orderId or Paid Status is not specified' };
      }
      // Find the order
      const orderData = await this.orderRepository.findOne({
        where: { id: orderId },
        relations: ['cart'],
      });

      if (!orderData) {
        return { type: 'Error', message: 'Order Not Found' };
      }
      if ((paid === 'true' && orderData.paymentStatus) || (paid === 'false' && !orderData.paymentStatus)) {
        return { type: 'Error', message: 'redundant attempt to manipulate payment status' };
      }

      // change order payment status and update products
      const productids = orderData.cart.map((p) => p.productId);

      const products = await this.productRepository.findBy({ id: In(productids) });

      // if order is paid and order.payment status is not true
      if (paid === 'true' && !orderData.paymentStatus) {
        orderData.paymentStatus = true;
        orderData.updated = new Date();

        // Deduct From product Bought
        const updatedProducts = products.map((product) => {
          const quantity = orderData.cart.find((q) => q.productId === product.id)?.quantity || 0;

          return { ...product, unitCount: product.unitCount - quantity };
        });

        console.log('changed to true and quantity deducted');
        await this.productRepository.save(updatedProducts);
      }

      if (paid === 'false' && orderData.paymentStatus) {
        orderData.paymentStatus = false;
        orderData.updated = new Date();

        // add it back up
        const updatedProducts = products.map((product) => {
          const quantity = orderData.cart.find((q) => q.productId === product.id)?.quantity || 0;

          return { ...product, unitCount: product.unitCount + quantity };
        });

        console.log('changed to false and quantity bought added back');
        await this.productRepository.save(updatedProducts);
      }

      await this.orderRepository.save(orderData);

      await queryRunner.commitTransaction();

      return { type: 'Success', message: 'Payment status successfully Changed', orderData };
    } catch (error) {
      await queryRunner.rollbackTransaction();
      return { type: 'Error', message: error.message };
    } finally {
      await queryRunner.release();
    }
  }
}
