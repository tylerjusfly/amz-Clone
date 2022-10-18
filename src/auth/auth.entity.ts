import { BaseEntity } from '../base-entity';
import { Column, Entity } from 'typeorm';

@Entity('users')
export class Auth extends BaseEntity {
  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  password: string;

  @Column({ type: 'text', nullable: true })
  bitconWallet: string;

  @Column({ type: 'text', nullable: true })
  bio: string;
}
