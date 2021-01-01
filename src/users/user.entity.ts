import { Table, Column, Model, ForeignKey, BelongsToMany, IsEmail, IsDate, AllowNull } from 'sequelize-typescript';

@Table
export class User extends Model<User> {
  @AllowNull(false)
  @Column
  username: string;

  @Column({primaryKey: true})
  user_id: string;

  @AllowNull(false)
  @Column
  first_name: string;

  @Column
  middle_name: string;

  @AllowNull(false)
  @Column
  last_name: string;

  @AllowNull(false)
  @Column
  dob: string;

  @AllowNull(false)
  @Column
  phone: string;

  @AllowNull(false)
  @IsEmail
  @Column
  email: string;

  @AllowNull(false)
  @Column
  gender: string;

  @AllowNull(false)
  @Column
  password: string;

  @BelongsToMany(() => Role, () => UserRole)
  roles: Role[];

}

@Table
export class Role extends Model<Role> {

  @Column({primaryKey: true})
  role_id: string;

  @AllowNull(false)
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

