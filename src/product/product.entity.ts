import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../base-entity'; /**import base Entity class for DRY Code */

export type ProductTypes = 'Foods' | 'Clothes' | 'Phones';

@Entity('products') /* Strictly mentioning the name of the table */
export class Product extends BaseEntity {
  @Column({ type: 'varchar', length: 100, nullable: false })
  productName: string;

  @Column({ type: 'varchar', nullable: false, default: 'Phones' })
  productType: ProductTypes;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: false })
  isSold: boolean;
}
