import {
  Column,
  Entity,
  JoinColumn,
  OneToMany,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Photo } from './Photo';
import { User } from './User';

@Entity()
export class Author {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToOne((type) => User, (user) => user.author)
  @JoinColumn()
  user: User;

  @OneToMany(() => Photo, (photo) => photo.author, { cascade: true })
  photos: Photo[];
}
