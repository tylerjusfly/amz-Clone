import { Injectable, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { convertToSlug } from 'src/common/utils';
import { MediaEntity } from 'src/database';
import { Repository } from 'typeorm';
import { ProductDto } from './dto';
import { ProductCategory } from './dto/productCategory';
import { Product } from './entity/product.entity';
import { ProductCategoryDb } from './entity/productcategory.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategoryDb)
    private productCategoryRepository: Repository<ProductCategoryDb>,
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
  ) {}

  //Method to create Function
  async Create(dto: ProductDto) {
    try {
      //check if Category Exists, save category name
      const existingCategory = await this.productCategoryRepository.findOneBy({ id: +dto.productCategory });

      if (!existingCategory) {
        throw new ForbiddenException({ type: 'Error', message: `Category Not Found` });
      }

      return { dto: dto };

      const product = await this.productRepository.save({ ...dto, productCategory: existingCategory.name });

      return { type: 'Success', message: 'successfully Created', product };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }

  async FetchAll() {
    try {
      const products = await this.productRepository.find();

      return { type: 'Success', products };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }

  //ADMINS ENDPOINTS

  async createProductCategory(dto: ProductCategory) {
    try {
      const slugify = convertToSlug(dto.name);

      //check if Category Exists
      const existingCategory = await this.productCategoryRepository.findOneBy({ slug: slugify });

      if (existingCategory) {
        throw new ForbiddenException({ type: 'Error', message: `Category Of '${dto.name}' Already Exists` });
      }

      const productCategory = await this.productCategoryRepository.save({ name: dto.name, slug: slugify });

      return { type: 'Success', message: 'successfully Created', productCategory };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }
}
