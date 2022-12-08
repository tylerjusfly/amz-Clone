import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class OrderDto {
  @IsArray()
  products: {
    productId: number;
    quantity: number;
    name: string;
    unitCount: number;
    price: number;
  }[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;
}
