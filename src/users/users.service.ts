import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidGenerator } from 'uuid';
import { User } from './user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(@Inject('USERS_REPOSITORY') private usersRepository: typeof User) {}

  async registerUser(userInfo: User): Promise<User> {
    let userExists = null;
    userExists = await this.getSingleUser(['username', 'email', 'phone'], userInfo);
    if (userExists) {
      throw new HttpException('User with the same detail(s) already exists.', HttpStatus.BAD_REQUEST);
    }
    userInfo.user_id = uuidGenerator();
    userInfo.password = await bcrypt.hash(userInfo.password, 10);
    const user = await this.usersRepository.create<User>(userInfo);
    return user;
  }

  async updateUser(userInfo: User): Promise<User> {
    if (userInfo.password) {
      userInfo.password = await bcrypt.hash(userInfo.password, 10);
    }
    const user = await this.usersRepository.update<User>(userInfo, {where: {user_id: userInfo.user_id}});
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    const allUsers =  await this.usersRepository.findAll();
    return allUsers;
  }

  async getSingleUser(findBy: string[], userDetails: User): Promise<User> {
    let user: User;
    for (let i = 0; i < findBy.length; i++) {
      const param = findBy[i];
      user = await this.usersRepository.findOne<User>({where: {[param]: userDetails[param]}});
      if (user) {
        return user;
      }
    }
  }
}
