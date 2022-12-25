import { Controller, Post, Body, Patch, Query, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderDto } from './order.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Get('')
  getOrders(@Query() options, @Body() params) {
    return this.orderService.fetchOrders(options, params);
  }

  @Post('')
  createOrder(@Body() orderDto: OrderDto) {
    return this.orderService.CreateOrder(orderDto);
  }

  @Patch('order-status')
  switchOrderStatus(@Query() { id }, @Body() data) {
    return this.orderService.SwitchOrderStatus(id, data);
  }

  @Patch('payment-status')
  switchPaymentStatus(@Query() { id, paid }) {
    return this.orderService.switchPaymentStatus(id, paid);
  }
}
