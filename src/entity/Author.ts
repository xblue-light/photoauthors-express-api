import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { Photo } from "./Photo";


@Entity()
export class Author {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @OneToMany(() => Photo, (photo) => photo.author, { cascade: true })
    photos: Photo[]
}