import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsBoolean, IsNumber, IsArray } from 'class-validator';
import { MediaEntity } from 'src/database';

export class ProductDto {
  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  name: string;

  @IsString()
  @IsNotEmpty()
  @ApiProperty()
  productCategory: string;

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

  // @IsArray()
  // images: MediaEntity;
  @IsArray()
  images: MediaEntity[];
}
