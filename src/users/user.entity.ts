import { Table, Column, Model, ForeignKey, BelongsToMany } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @Column
  username: string;

  @Column({primaryKey: true})
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

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];

}

@Table
export class Role extends Model<Role> {

  @Column({primaryKey: true})
  role_id: string;

  @Column
  role: string;

  @BelongsToMany(() => User, () => UserRole)
  users: User[];

}

@Table
export class UserRole extends Model<UserRole> {

  @ForeignKey(() => User)
  @Column
  user_id: string;

  @ForeignKey(() => Role)
  @Column
  role_id: string;

}

