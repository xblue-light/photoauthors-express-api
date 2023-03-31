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
  @JoinColumn() // userId will be stored as a foreign key in the author entity. Note its enough to make the connection user.author = new author and save the user no need to save author since cascade is true for User#author
  user: User;

  @OneToMany(() => Photo, (photo) => photo.author, { cascade: true })
  photos: Photo[];
}
