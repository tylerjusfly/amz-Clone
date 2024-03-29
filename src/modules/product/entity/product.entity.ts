import { Column, Entity, OneToMany, Index } from 'typeorm';
import { BaseEntity, MediaEntity } from '../../../database'; /**import base Entity class for DRY Code */

@Entity('products') /* Strictly mentioning the name of the table */
export class Product extends BaseEntity {
  @Index('product_name_index')
  @Column({ type: 'varchar', nullable: true })
  name: string;

  @Column({ type: 'varchar' })
  productCategory: string;

  @Column({ type: 'varchar', nullable: false })
  brand: string;

  @Column({ type: 'varchar', nullable: false })
  color: string;

  @Column({ type: 'text', nullable: false })
  description: string;

  @Column({ type: 'boolean', default: false })
  isAvailable: boolean;

  @Column({ type: 'decimal', nullable: false, precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'integer', nullable: false, default: 0.0 })
  rating: number;

  @Column({ type: 'integer', nullable: false })
  unitCount: number;

  @OneToMany(() => MediaEntity, (images: MediaEntity) => images.product, { cascade: true })
  medias: MediaEntity[];

  @Column({ type: 'integer', nullable: false })
  userId: number;
}
