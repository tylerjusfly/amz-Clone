import { BaseEntity } from '../../database/base-entity';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Role } from 'src/database/roles.entity';

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

  @ManyToMany(() => Role)
  @JoinTable({ name: 'user_roles' })
  roles: Role[];
}
