import { ApiProperty } from '@nestjs/swagger';

export class PaginationInterface {
  @ApiProperty()
  page: number;

  @ApiProperty()
  limit: number;
}
