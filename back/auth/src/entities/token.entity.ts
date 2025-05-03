import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class Token {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    nullable: false,
    name: 'user_id',
  })
  userId: number;

  @Column({
    nullable: false,
    unique: true,
    name: 'refresh_token',
  })
  refreshToken: string;
}
