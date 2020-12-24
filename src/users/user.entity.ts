import { Table, Column, Model } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column
  username: string;

  @Column
  user_id: string;

  @Column
  first_name: string;

  @Column
  middle_name: string;

  @Column
  last_name: string;

  @Column
  dob: string;

  @Column
  phone: string;

  @Column
  email: string;

  @Column
  gender: string;

  @Column
  password: string;
}