import { Column, Entity, JoinColumn, ManyToOne } from 'typeorm';
import { BaseEntity } from './base-entity';
import { Product } from '../modules/product/entity/product.entity';

@Entity('medialinks')
export class MediaEntity extends BaseEntity {
  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'varchar' })
  filetype: string;

  @Column({ type: 'text', nullable: false })
  url: string;

  @Column({ type: 'varchar' })
  mediaCategory: string;

  //Many Pictures Belongs to One Product
  @ManyToOne(() => Product, (product: Product) => product.medias, { onDelete: 'CASCADE', onUpdate: 'CASCADE', nullable: true })
  /*JoinColumn is used to create a custom Column Name */
  @JoinColumn({ name: 'product_id' })
  product: Product;

  //we will have a productId refrencing the Product Entity
}
