import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsNumber } from 'class-validator';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  productType: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  description: string;

  @IsBoolean()
  @IsNotEmpty()
  @ApiProperty()
  isAvailable: boolean;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  color: string;

  @IsNumber()
  @IsNotEmpty()
  @ApiProperty()
  unitCount: number;
}
