import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../auth/auth.guard';
import { Role, User, UserRole } from './user.entity';
import { UsersService } from './users.service';
import { AuthRole, Roles } from '../auth/roles.decorator';

export interface AddUserRole {
    user_id: string;
    role: string;
}

@Controller('users')
export class UsersController {
  constructor(private userService: UsersService) {}

  @UseGuards(JwtAuthGuard)
  @Roles(AuthRole.User)
  @Get('fetch')
  getUsers(@Query('user_id') user_id: string): Promise<User[]> {
    const args = [{ user_id }].filter(arg => {
      const argKeys = Object.keys(arg);
      if (arg[argKeys[0]]) {
        return arg;
      }
    });
    return this.userService.getAllUsers(...args);
  }

  @Post('create-user')
  registerUser(@Body() user: User): Promise<any> {
    return this.userService.registerUser(user);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('delete-user/:user_id')
  deleteUser(@Param('user_id') user_id: string): Promise<any> {
    return this.userService.deleteUser(user_id);
  }

  // @UseGuards(JwtAuthGuard)
  @Post('add-role')
  addRole(@Body() role: Role): Promise<any> {
    return this.userService.addRole(role);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('revoke-role/:role_id')
  revokeRole(@Param('role_id') role_id: string): Promise<any> {
    return this.userService.revokeRole(role_id);
  }

  @UseGuards(JwtAuthGuard)
  @Post('add-user-role')
  addUserRole(@Body() userRole: AddUserRole): Promise<any> {
    return this.userService.addUserRole(userRole);
  }

  @UseGuards(JwtAuthGuard)
  @Delete('revoke-user-role/:role_id')
  revokeUserRole(@Param('role_id') role_id: string): Promise<any> {
    return this.userService.revokeUserRole(role_id);
  }

  @UseGuards(JwtAuthGuard)
  @Get('fetch-roles')
  fetchRoles(@Query('user_id') user_id: string): Promise<Role[] | UserRole[]> {
    const args = [{ user_id }].filter(arg => {
      const argKeys = Object.keys(arg);
      if (arg[argKeys[0]]) {
        return arg;
      }
    });

    return this.userService.getRoles(...args);
  }

  @UseGuards(JwtAuthGuard)
  @Put('update-user')
  updateUser(@Body() user: User): Promise<any> {
    return this.userService.updateUser(user);
  }
}
