import { Body, Controller, Get, Param, Post, Put } from '@nestjs/common';
import { Role, User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get('fetch')
    getUsers(@Param() params: string[]): Promise<User[]> {
        return this.userService.getAllUsers(params);
    }

    @Post('create-user')
    registerUser(@Body() user: User): Promise<User> {
        return this.userService.registerUser(user);
    }

    @Post('add-role')
    addRole(@Body() role: Role): Promise<Role> {
        return this.userService.addRole(role);
    }

    @Get('fetch-roles')
    fetchRoles(): Promise<Role[]> {
        return this.userService.getRoles();
    }

    @Put('update-user')
    updateUser(@Body() user: User): Promise<User> {
        return this.userService.updateUser(user);
    }
}
