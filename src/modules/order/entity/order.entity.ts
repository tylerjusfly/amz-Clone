import { CartEntity } from 'src/modules/cart/cart.entity';
import { Column, Entity, OneToMany } from 'typeorm';
import { BaseEntity } from '../../../database';

export type OrderType = 'Not processed' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

@Entity('orders')
export class OrderEntity extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  orderId: string;

  @OneToMany(() => CartEntity, (cart: CartEntity) => cart.order, { cascade: true })
  cart: CartEntity[];

  @Column({ type: 'integer', nullable: true })
  totalPrice: number;

  @Column({ type: 'text' })
  address: string;

  //one to many relationship
  @Column()
  userId: string;

  @Column()
  updated: Date;

  @Column({
    type: 'enum',
    enum: ['Not processed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    default: 'Not processed',
  })
  status: OrderType;

  @Column({ type: 'boolean', default: false })
  paymentStatus: boolean;
}
