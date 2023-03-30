import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Unique,
  OneToMany,
} from 'typeorm'
import { Length, IsNotEmpty } from 'class-validator'
import { Photo } from './Photo'

@Entity()
@Unique(['username'])
export class User {
  @PrimaryGeneratedColumn()
  id: number

  @Column()
  @IsNotEmpty()
  @Length(5, 20)
  username: string

  @Column()
  @IsNotEmpty()
  email: string

  @Column()
  @Length(5, 100)
  password: string

  @Column()
  @IsNotEmpty()
  role: string

  // @Column()
  // @UpdateDateColumn()
  // updatedAt: Date;

  @OneToMany(() => Photo, (photo) => photo.user, { cascade: true })
  photos: Photo[]
}
