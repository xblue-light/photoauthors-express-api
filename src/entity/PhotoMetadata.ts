import {
  Column,
  Entity,
  JoinColumn,
  OneToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Photo } from './Photo';

@Entity()
export class PhotoMetadata {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('int')
  height: number;

  @Column('int')
  width: number;

  @Column()
  orientation: string;

  @Column()
  compressed: boolean;

  @Column()
  comment: string;

  // Without the onDelete: 'CASCADE' option, you would have to manually delete the associated PhotoMetadata record before you could delete the Photo record.
  @OneToOne(() => Photo, (photo) => photo.metadata, { onDelete: 'CASCADE' })
  @JoinColumn()
  photo: Photo;
}
