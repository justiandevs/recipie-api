import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  public id?: number;

  @Column({ unique: true })
  public email: string;

  @Column()
  public name: string;

  @Column()
  public password: string;

  // TODO: Implement one-to-many relation between User table and a specific refresh token table
  @Column()
  public refreshToken: string;
}
