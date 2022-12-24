import { Column, Entity } from 'typeorm';
import { BaseEntity } from './base-entity';

@Entity({ name: 'roles' })
export class Role extends BaseEntity {
  @Column({ type: 'varchar', nullable: false })
  name: string;
}
