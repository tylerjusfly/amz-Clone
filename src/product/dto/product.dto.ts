import { IsString, IsNotEmpty, IsBoolean } from 'class-validator';
import { ProductTypes } from '../product.entity';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  productName: string;

  @IsString()
  @IsNotEmpty()
  productType: ProductTypes;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  isSold: boolean;
}
