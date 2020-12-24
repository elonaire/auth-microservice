import { Body, Controller, Get, Post, Put } from '@nestjs/common';
import { User } from './user.entity';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
    constructor(private userService: UsersService) {}

    @Get('fetch')
    getUsers(): Promise<User[]> {
        return this.userService.getAllUsers();
    }

    @Post('create-user')
    registerUser(@Body() user: User): Promise<User> {
        return this.userService.registerUser(user);
    }

    @Put('update-user')
    updateUser(@Body() user: User): Promise<User> {
        return this.userService.updateUser(user);
    }
}
