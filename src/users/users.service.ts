import { HttpException, HttpStatus, Inject, Injectable } from '@nestjs/common';
import { v4 as uuidGenerator } from 'uuid';
import { Role, User, UserRole } from './user.entity';
import * as bcrypt from 'bcrypt';
import { Op } from 'sequelize';
import { LoginDetails } from '../app.controller';
import {
  ROLES_REPOSITORY,
  USERS_REPOSITORY,
  USER_ROLES_REPOSITORY,
} from '../constants';
import { AddUserRole } from './users.controller';

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

    // verify role
    const roleFound = await this.rolesRepository.findOne<Role>({
      where: { role: userInfo['role'] || 'USER' },
    });
    if (!roleFound) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    userInfo.password = await bcrypt.hash(userInfo.password, 10);
    const userRole = new UserRole({
      role_id: roleFound.role_id,
      user_id: userInfo.user_id,
    });
    const user: User = await this.usersRepository.create<User>(userInfo);
    const otherRoles = await user.$get('roles');
    if (user) {
      if (otherRoles && otherRoles.length > 0) {
        // inserting into UserRoles through-table)
        await user.$add('roles', userRole.role_id, {
          through: { isPrimary: false },
        });
      } else {
        // inserting into UserRoles through-table)
        await user.$add('roles', userRole.role_id, {
          through: { isPrimary: true },
        });
      }

      return user;
    }
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

  async getAllUsers(...params: any[]): Promise<User[]> {
    // console.log('params', params);

    let users: User[];
    if (params.length > 0) {
      users = await this.usersRepository.findAll({
        where: { [Op.and]: [...params.map(param => param)] },
      });
    } else {
      users = await this.usersRepository.findAll();
    }

    return users;
  }

  async getSingleUser(
    findBy: string[],
    check: 'either' | 'all',
    userDetails: User | LoginDetails | any,
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
    const roleExists = await this.rolesRepository.findOne<Role>({
      where: { role: roleInfo.role },
    });
    if (roleExists) {
      throw new HttpException('Role already exists.', HttpStatus.BAD_REQUEST);
    }
    roleInfo.role_id = uuidGenerator();
    const newRole = await this.rolesRepository.create(roleInfo);
    return newRole;
  }

  async addUserRole(roleInfo: AddUserRole): Promise<UserRole> {
    // verify role existance in DB
    const roleFound: Role = await this.rolesRepository.findOne<Role>({
      where: { role: roleInfo['role'] },
    });
    if (!roleFound) {
      throw new HttpException('Invalid role', HttpStatus.BAD_REQUEST);
    }

    const userHasRole = await this.getRoles([{user_id: roleInfo.user_id, role_id: roleFound.role_id}]);
    if (userHasRole.length > 0) {
      throw new HttpException('User already has this role', HttpStatus.BAD_REQUEST);
    }
    const user = await this.getSingleUser(['user_id'], 'either', roleInfo);
    const newRole = await user.$add('roles', roleFound.role_id, {through: {isPrimary: false}});
    // console.log('newRole', newRole);
    
    return newRole;
  }

  async getRoles(...params: any[]): Promise<Role[] | UserRole[]> {
    let roles: Role[] | UserRole[];
    if (params.length > 0) {
      roles = await this.userRolesRepository.findAll({
        where: { [Op.and]: [...params.map(param => param)] },
      });
    } else {
      roles = await this.rolesRepository.findAll();
    }
    return roles;
  }

  async revokeRole(role_id: string): Promise<any> {
    const revokedRole = await this.rolesRepository.destroy({where: {role_id}});
    if (!revokedRole) {
      throw new HttpException('Cannot revoke', HttpStatus.BAD_REQUEST);
    }
    return revokedRole;
  }

  async revokeUserRole(role_id: string): Promise<any> {
    const revokedRole = await this.userRolesRepository.destroy({where: {role_id, isPrimary: {[Op.ne]: true}}});
    if (!revokedRole) {
      throw new HttpException('Cannot revoke', HttpStatus.BAD_REQUEST);
    }
    return revokedRole;
  }
}
