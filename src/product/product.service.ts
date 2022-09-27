import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductDto } from './dto';
import { Product } from './product.entity';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
  ) {}

  //Method to create Function
  async Create(dto: ProductDto) {
    const product = await this.productRepository.save(dto);
    return { product };
  }

  async FetchAll(): Promise<{ products: Product[] }> {
    const products = await this.productRepository.find();

    return { products };
  }
}
