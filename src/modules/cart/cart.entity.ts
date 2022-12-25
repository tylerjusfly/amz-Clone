import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from 'typeorm';
import { BaseEntity } from '../../database/base-entity';
import { OrderEntity } from '../order/entity/order.entity';
import { Product } from '../product/entity/product.entity';

@Entity('carts')
export class CartEntity extends BaseEntity {
  @Column({ nullable: false })
  productId: number;

  @Column()
  name: string;

  @Column({ type: 'decimal', nullable: false, precision: 10, scale: 2 })
  price: number;

  @Column({ type: 'integer' })
  unitCount: number;

  @Column()
  quantity: number;

  @ManyToOne(() => OrderEntity, (order: OrderEntity) => order.cart, { nullable: true })
  /*JoinColumn is used to create a custom Column Name */
  @JoinColumn({ name: 'order_id' })
  order: OrderEntity;
}
