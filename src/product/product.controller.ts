import { Controller, Post, Body } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto';

@Controller('product')
export class ProductController {
  constructor(private productService: ProductService) {}

  //using Body decorators Gets the body from the request
  @Post('create')
  AddProduct(@Body() dto: ProductDto) {
    return this.productService.Create(dto);
  }
}
