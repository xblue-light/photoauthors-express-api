import { Entity, PrimaryGeneratedColumn, Column, Unique, UpdateDateColumn } from "typeorm";
import { Length, IsNotEmpty } from "class-validator";

@Entity()
@Unique(["username"])
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

}
