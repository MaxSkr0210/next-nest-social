import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        nullable: false,
        unique: true,
    })
    username: string;

    @Column({
        unique: true,
        nullable: false,
    })
    email: string;

    @Column({
        nullable: false,
    })
    password: string;
}
