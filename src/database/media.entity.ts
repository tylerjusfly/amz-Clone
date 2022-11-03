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

  // @JoinColumn({ name: 'productid', referencedColumnName: 'id' })
  @ManyToOne(() => Product, (product) => product.images, { onDelete: 'CASCADE' })
  product: Product;
}
