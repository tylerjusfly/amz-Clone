import { Column, Entity } from 'typeorm';
import { BaseEntity } from '../../../database/base-entity';

@Entity('productCategory')
export class ProductCategoryDb extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  slug: string;
}
