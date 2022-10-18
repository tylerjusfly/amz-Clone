import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../base-entity'; /**import base Entity class for DRY Code */
import { ApiProperty } from '@nestjs/swagger';

@Entity('products') /* Strictly mentioning the name of the table */
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 100 })
  name: string;

  @Column({ type: 'varchar', nullable: false })
  productType: string;

  @Column({ type: 'varchar', nullable: false })
  brand: string;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: false })
  isAvailable: boolean;

  @Column({ type: 'integer', nullable: false, default: 0.0 })
  rating: number;

  @Column({ type: 'integer', nullable: false })
  unitCount: number;
}
