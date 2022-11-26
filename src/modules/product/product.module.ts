import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductController } from './product.controller';
import { Product } from './entity/product.entity';
import { ProductService } from './product.service';
import { ProductCategoryDb } from './entity/productcategory.entity';
import { MediaEntity } from 'src/database';

@Module({
  imports: [TypeOrmModule.forFeature([Product, ProductCategoryDb, MediaEntity])],
  controllers: [ProductController],
  providers: [ProductService],
  //exports: [Product],
})
export class ProductModule {}
