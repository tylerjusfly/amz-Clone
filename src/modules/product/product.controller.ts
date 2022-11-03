import { Controller, Post, Get, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto';
import { ApiTags } from '@nestjs/swagger';
import { ProductCategory } from './dto/productCategory';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  //using Body decorators Gets the body from the request
  @HttpCode(HttpStatus.CREATED)
  @Post('create')
  AddProduct(@Body() dto: ProductDto) {
    return this.productService.Create(dto);
  }

  @HttpCode(HttpStatus.OK)
  @Get('all')
  GetAllProducts() {
    return this.productService.FetchAll();
  }

  /**ADMINN FUNCTIONS */
  @Post('category/create')
  CreateCategory(@Body() dto: ProductCategory) {
    return this.productService.createProductCategory(dto);
  }
}
