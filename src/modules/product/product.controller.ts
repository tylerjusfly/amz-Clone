import { Controller, Post, Get, Body, HttpCode, HttpStatus, Query, UseGuards } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductCategory } from './dto/productCategory';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorators';
import { PaginationInterface } from '../../common/pagination.dto';
import { Auth } from '../auth/auth.entity';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  //using Body decorators Gets the body from the request
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtGuard) //pass user object into the request
  @Post('create')
  AddProduct(@GetUser() user: Auth, @Body() dto: ProductDto) {
    return this.productService.Create(dto, user.id);
  }

  @HttpCode(HttpStatus.OK)
  @Get('all')
  @ApiParam({ name: 'page', description: 'Gets the page number' })
  @ApiParam({ name: 'limit', description: 'Gets limit per page' })
  GetAllProducts(@Query() urlParams) {
    // const limit = params.limit ? +params.limit : 4;
    // const offset = params.page ? params.page - 1 * limit : 0;

    return this.productService.FetchAll(urlParams);
  }

  @Get('one')
  GetOneProduct(@Query() { id }) {
    return this.productService.FindOne(id);
  }

  /**ADMINN FUNCTIONS */
  @Post('category/create')
  CreateCategory(@Body() dto: ProductCategory) {
    return this.productService.createProductCategory(dto);
  }
}
