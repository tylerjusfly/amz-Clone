import { PrimaryGeneratedColumn, CreateDateColumn } from 'typeorm';

export class BaseEntity {
  @PrimaryGeneratedColumn()
  id: number; /** Auto Increment */

  @CreateDateColumn({ nullable: true })
  createdAt?: Date;

  @CreateDateColumn({ nullable: true })
  updatedAt?: Date;
}
