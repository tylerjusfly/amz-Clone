import { Controller, Post, Get, Body, HttpCode, HttpStatus, Query, UseGuards, Patch, Delete } from '@nestjs/common';
import { ProductService } from './product.service';
import { ProductDto } from './dto';
import { ApiParam, ApiTags } from '@nestjs/swagger';
import { ProductCategory } from './dto/productCategory';
import { JwtGuard } from '../auth/guard';
import { GetUser } from '../auth/decorators';
import { Auth } from '../auth/auth.entity';
import { RoleGuard, Roles } from '../auth/guard/role.guard';
import { RoleName } from 'src/common/utils';

@ApiTags('products')
@Controller('products')
export class ProductController {
  constructor(private productService: ProductService) {}

  //using Body decorators Gets the body from the request
  @HttpCode(HttpStatus.CREATED)
  @Roles(RoleName.ADMIN, RoleName.SELLER)
  @UseGuards(JwtGuard, RoleGuard) //pass user object into the request
  @Post('/create')
  AddProduct(@GetUser() user: Auth, @Body() dto: ProductDto) {
    return this.productService.Create(dto, user.id);
  }

  @Get('/all')
  @ApiParam({ name: 'page', description: 'Gets the page number' })
  @ApiParam({ name: 'limit', description: 'Gets limit per page' })
  GetAllProducts(@Query() urlParams, @Body() data) {
    return this.productService.fetchProducts(urlParams, data);
  }

  @Get('one')
  GetOneProduct(@Query() { id }) {
    return this.productService.findOne(id);
  }

  @Roles(RoleName.SELLER, RoleName.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Patch('edit')
  editProduct(@GetUser() user: Auth, @Query() { pid }, @Body() params) {
    return this.productService.editProduct(pid, params, user);
  }

  @Delete('delete')
  removeProduct(@Query() { pid }) {
    return this.productService.removeProduct(pid);
  }

  /**ADMINN FUNCTIONS */
  @Roles(RoleName.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Post('category/create')
  CreateCategory(@Body() dto: ProductCategory) {
    return this.productService.createProductCategory(dto);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Get('category/all')
  getAllCategories(@GetUser() user: Auth, @Query() params) {
    return this.productService.getAllProductCategories(params, user);
  }

  @Roles(RoleName.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @Delete('category/delete')
  removeCategory(@Query() { cid }) {
    return this.productService.removeCategory(cid);
  }
}
