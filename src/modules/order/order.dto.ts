import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsNumber, IsArray } from 'class-validator';

export class OrderDto {
  @IsArray()
  products: {
    product: string;
    quantity: number;
  }[];

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  address: string;
}
