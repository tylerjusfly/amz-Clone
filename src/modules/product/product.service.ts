import { Injectable, ForbiddenException, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { convertToSlug } from 'src/common/utils';
import { MediaEntity } from 'src/database';
import { Repository } from 'typeorm';
import { ProductDto } from './dto';
import { ProductCategory } from './dto/productCategory';
import { Product } from './entity/product.entity';
import { ProductCategoryDb } from './entity/productcategory.entity';
import { PaginationInterface } from '../../common/pagination.dto';

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
  async Create(dto: ProductDto, id: number) {
    try {
      //check if Category Exists, save category name
      const existingCategory = await this.productCategoryRepository.findOneBy({ id: +dto.productCategory });

      if (!existingCategory) {
        throw new ForbiddenException({ type: 'Error', message: `Category Not Found` });
      }

      if (dto.images.length !== 5) {
        throw new ForbiddenException({ type: 'Error', message: `5 Images are Required to Create A Product` });
      }

      //Create Product
      const product = await this.productRepository.save({
        ...dto,
        productCategory: existingCategory.name,
        userId: id,
      });

      const pushImages = [];

      for (let i = 0; i < dto.images.length; i++) {
        let image = {
          ...dto.images[i],
          mediaCategory: 'PRODUCTS',
          product: product,
        };

        pushImages.push(image);
      }

      await this.mediaRepository.createQueryBuilder().insert().into(MediaEntity).values(pushImages).execute();

      return { type: 'Success', message: 'successfully Created', product };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }

  async FetchAll(params: PaginationInterface) {
    try {
      //converting values to number, and cross Checking if Number
      let { page, limit } = params;

      page = Number(page) ? +page : 1;

      limit = +limit ? +limit : 10;

      const take = Number(limit);

      const offset = (page - 1) * Number(limit);

      //create Query to get many products , orderBy DESC
      const query = this.productRepository.createQueryBuilder('products');

      query.orderBy('products.createdAt', 'DESC').take(take).skip(offset);

      //Get count of products
      const total = await query.getCount();
      const products = await query.getMany();

      if (!products) return { type: 'Error', message: 'products Not found' };

      return {
        type: 'Success',
        result: products,
        totalPages: Math.ceil(total / take),
        itemsPerPage: limit,
        totalItems: total,
        currentPage: page,
      };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }

  /**Fetch Single Product By ID */
  async findOne(id: number) {
    try {
      const product = await this.productRepository.findOneBy({ id: id });

      if (!product) {
        return { type: 'Error', message: `product with id ${id} does not exist` };
      }

      return product;
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
        return { type: 'Error', message: `Category Of '${dto.name}' Already Exists` };
      }

      const productCategory = await this.productCategoryRepository.save({ name: dto.name, slug: slugify });

      return { type: 'Success', message: 'successfully Created', productCategory };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }

  //Delete a Category
}
