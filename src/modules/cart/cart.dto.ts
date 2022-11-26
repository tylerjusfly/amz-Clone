import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsArray } from 'class-validator';

export class CartDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  productId: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  quantity: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  userId: number;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  orderId: number;
}
