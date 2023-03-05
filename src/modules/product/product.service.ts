import { Injectable, ForbiddenException, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { convertToSlug, toTitleCase } from 'src/common/utils';
import { MediaEntity } from 'src/database';
import { Repository, DataSource } from 'typeorm';
import { ProductDto } from './dto';
import { ProductCategory } from './dto/productCategory';
import { Product } from './entity/product.entity';
import { ProductCategoryDb } from './entity/productcategory.entity';
import { PaginationInterface } from '../../common/pagination.dto';
import { isAdmin, isOwner, isOwnerOrAdmin } from '../auth/decorators/checkAuth';
import { Auth } from '../auth/auth.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(ProductCategoryDb)
    private productCategoryRepository: Repository<ProductCategoryDb>,
    @InjectRepository(MediaEntity)
    private mediaRepository: Repository<MediaEntity>,
    private dataSource: DataSource,
  ) {}

  //Method to create Function
  async Create(dto: ProductDto, id: number) {
    try {
      //check if Category Exists, save category name
      const existingCategory = await this.productCategoryRepository.findOneBy({ id: +dto.productCategory });

      if (!existingCategory) {
        return { type: 'Error', message: `Category Not Found` };
      }

      if (dto.images.length !== 5) {
        return { type: 'Error', message: `5 Images are Required to Create A Product` };
      }

      //Create Product
      const product = await this.productRepository.save({
        ...dto,
        name: toTitleCase(dto.name),
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

  async fetchProducts(params: PaginationInterface, data) {
    try {
      //create Query to get many products , orderBy DESC
      const query = this.productRepository.createQueryBuilder('products');

      if (data.userid && data.userid !== '') {
        query.where('products.userId = :userid', { userid: data.userid });
      }

      //if category exists
      if (data.category && data.category !== '') {
        // Find the category
        const category = await this.productCategoryRepository.findOneBy({ id: data.category });

        if (!category) return { type: 'Error', message: 'category not found' };

        query.andWhere('products.productCategory = :categoryname', { categoryname: category.name });
      }

      if (data.name && data.name !== '') {
        let formattedName = toTitleCase(data.name);
        query.andWhere('products.name LIKE :name', { name: `%${formattedName}%` });
      }

      const page = +params.page - 1;

      let products = await query
        .offset(page * +params.limit)
        .limit(+params.limit)
        .orderBy('products.createdAt', 'DESC')
        .getMany();

      //Get count of products
      const total = await query.getCount();

      return {
        type: 'Success',
        result: products,
        totalPages: Math.ceil(total / params.limit),
        itemsPerPage: params.limit,
        totalItems: total,
        currentPage: params.page,
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

      return { type: 'Success', product };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }

  // Edit product
  async editProduct(pid: number, params: ProductDto, user) {
    const queryRunner = this.dataSource.createQueryRunner();

    // establish real database connection using our new query runner
    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      const product = await this.productRepository.findOneBy({ id: pid });

      if (!product) {
        return { type: 'Error', message: 'Invalid Product' };
      }

      if (!isOwner(user, product.userId)) {
        return { type: 'Unauthorized', message: 'Owner Can Only edit' };
      }

      product.name = params.name;
      product.description = params.description;
      product.price = params.price;
      product.brand = params.brand;
      product.color = params.color;
      product.isAvailable = params.isAvailable;

      // Find product Category
      const category = await this.productCategoryRepository.findOneBy({ id: +params.productCategory });

      if (!category) return { type: 'Error', message: 'category not found' };

      product.productCategory = category.name;
      product.unitCount = params.unitCount;

      //save transaction before committing
      await this.productRepository.save(product);

      await queryRunner.commitTransaction();

      return { type: 'Success', product };
    } catch (error) {
      // since we have errors let's rollback changes we made
      await queryRunner.rollbackTransaction();
      return { type: 'Error', message: error.message };
    } finally {
      await queryRunner.release();
    }
  }

  // Remove Product with Transaction
  //transaction performs two DELETE statements executed together as a single unit.

  async removeProduct(pid: number) {
    try {
      const result = await this.productRepository
        .createQueryBuilder()
        .delete()
        .from(Product)
        .where('id = :id', { id: pid })
        .execute();

      if (!result.affected) {
        return { type: 'Error', message: 'Product does not exist' };
      } else {
        return { type: 'Success', message: 'successfully Deleted' };
      }
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

  async getAllProductCategories(user: Auth) {
    try {
      const categoriesQuery = this.productCategoryRepository.createQueryBuilder('categories');

      let productCategories = await categoriesQuery.orderBy('categories.createdAt', 'DESC').getMany();

      //Get count of products
      const total = await categoriesQuery.getCount();

      return {
        type: 'Success',
        result: productCategories,
        totalItems: total,
      };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }

  //Delete a Category
  async removeCategory(categoryid: number) {
    try {
      //Find all Product with this category,
      // Set category to "deleted", this will let user re assign its product to another category
      // or others category
      const data = await this.productCategoryRepository.findOne({ where: { id: categoryid } });

      if (!data) {
        return { type: 'Error', message: 'Category does not exist' };
      }

      //Find All Product with This Category
      let products = await this.productRepository.find({ where: { productCategory: data.name } });

      for (const item of products) {
        item.productCategory = 'Others';
      }
      // Save the updated entities
      await this.productRepository.save(products);

      // Delete the data
      await this.productCategoryRepository.remove(data);

      return { type: 'Success', message: 'successfully Deleted' };
    } catch (error) {
      return { type: 'Error', message: error.message };
    }
  }
}
