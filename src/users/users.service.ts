import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidGenerator } from 'uuid';
import { Role, User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { LoginDetails } from '../app.controller';
import { ROLES_REPOSITORY, USERS_REPOSITORY, USER_ROLES_REPOSITORY } from '../constants';

@Injectable()
export class UsersService {
  constructor(
    @Inject(USERS_REPOSITORY) private usersRepository: typeof User,
    @Inject(ROLES_REPOSITORY) private rolesRepository: typeof Role,
    @Inject(USER_ROLES_REPOSITORY) private userRolesRepository: typeof UserRole,
  ) {}

  async registerUser(userInfo: User): Promise<User> {
    let userExists = null;
    userExists = await this.getSingleUser(
      ['username', 'email', 'phone'],
      'either',
      userInfo,
    );
    if (userExists) {
      throw new HttpException(
        'User with the same detail(s) already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }

    // generate uuid - user_id
    userInfo.user_id = uuidGenerator();

    let roleFound: Role;
    // add role
    if (userInfo['role']) {
      roleFound = await this.rolesRepository.findOne<Role>({where: {role: userInfo['role']}});
      if (!roleFound) {
        throw new HttpException(
          'Invalid role',
          HttpStatus.BAD_REQUEST,
        );
      }
    }
    
    userInfo.password = await bcrypt.hash(userInfo.password, 10);
    const userRole = new UserRole({role_id: roleFound.role_id, user_id: userInfo.user_id});
    const user: User = await this.usersRepository.create<User>(userInfo);
    
    // inserting into UserRoles through-table)
    await user.$add('roles', userRole.role_id);
    return user;
  }

  async updateUser(userInfo: User): Promise<User> {
    if (userInfo.password) {
      userInfo.password = await bcrypt.hash(userInfo.password, 10);
    }
    const user = await this.usersRepository.update<User>(userInfo, {
      where: { user_id: userInfo.user_id },
    });
    return user;
  }

  async getAllUsers(params?: string[]): Promise<User[]> {
    console.log('params', params);
    
    const allUsers = await this.usersRepository.findAll();
    return allUsers;
  }

  async getSingleUser(
    findBy: string[],
    check: 'either' | 'all',
    userDetails: User | LoginDetails,
  ): Promise<User> {
    let operator: any;
    if (check === 'either') {
      operator = {
        [Op.or]: [
          ...findBy.map(prop => {
            return { [prop]: userDetails[prop] };
          }),
        ],
      };
    } else {
      operator = {
        [Op.and]: [
          ...findBy.map(prop => {
            return { [prop]: userDetails[prop] };
          }),
        ],
      };
    }
    const user = await this.usersRepository.findOne<User>({
      where: operator,
    });
    if (user) {
      return user;
    }
  }

  async addRole(roleInfo: Role): Promise<Role> {
    const roleExists = await this.rolesRepository.findOne<Role>({where: {role: roleInfo.role}});
    if (roleExists) {
      throw new HttpException(
        'Role already exists.',
        HttpStatus.BAD_REQUEST,
      );
    }
    roleInfo.role_id = uuidGenerator();
    const newRole = await this.rolesRepository.create(roleInfo);
    return newRole;
  }

  async getRoles(): Promise<Role[]> {
    const roles = await this.rolesRepository.findAll();
    return roles;
  }
}
