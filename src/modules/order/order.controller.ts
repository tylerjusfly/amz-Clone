import { Controller, Post, Body } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderDto } from './order.dto';
import { OrderService } from './order.service';

@ApiTags('orders')
@Controller('orders')
export class OrderController {
  constructor(private orderService: OrderService) {}

  @Post('')
  createOrder(@Body() orderDto: OrderDto) {
    return this.orderService.CreateOrder(orderDto);
  }
}
