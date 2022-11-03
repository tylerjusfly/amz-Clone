import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ProductCategory {
  @IsNotEmpty()
  @IsString()
  @ApiProperty()
  name: string;
}
