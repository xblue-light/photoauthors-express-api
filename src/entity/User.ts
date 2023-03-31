import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
  OneToOne,
  UpdateDateColumn,
  CreateDateColumn,
  JoinColumn,
} from 'typeorm';
import { Length, IsNotEmpty } from 'class-validator';
import { Photo } from './Photo';
import { Author } from './Author';

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @IsNotEmpty()
  @Length(5, 20)
  username: string;

  @Column()
  @IsNotEmpty()
  email: string;

  @Column()
  @Length(5, 100)
  password: string;

  @Column()
  @IsNotEmpty()
  role: string;

  // @Column()
  // @UpdateDateColumn()
  // updatedAt: Date;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @OneToOne((type) => Author, (author) => author.user, {
    cascade: true,
  })
  author: Author;
}
