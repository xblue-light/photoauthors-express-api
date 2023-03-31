import {
  Column,
  Entity,
  JoinColumn,
  ManyToMany,
  ManyToOne,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Album } from './Album';
import { Author } from './Author';
import { PhotoMetadata } from './PhotoMetadata';
import { User } from './User';

@Entity()
export class Photo {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    length: 100,
  })
  name: string;

  @Column('text')
  description: string;

  @Column()
  filename: string;

  @Column()
  views: number;

  @Column()
  isPublished: boolean;

  @OneToOne(() => PhotoMetadata, (photoMetadata) => photoMetadata.photo, {
    cascade: true,
  })
  metadata: PhotoMetadata;

  @ManyToOne(() => Author, (author) => author.photos)
  author: Author;

  @ManyToMany(() => Album, (album) => album.photos)
  albums: Array<Album>;

  // @ManyToOne(() => User, (user) => user.photos)
  // user: User;
}
