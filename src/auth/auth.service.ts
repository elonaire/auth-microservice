import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { User } from '../users/user.entity';
import { LoginDetails } from '../app.controller';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(loginDetails: LoginDetails): Promise<any> {
    const user = await this.usersService.getSingleUser(['username'], 'either', loginDetails);
    if (!user) {
      throw new HttpException(
        'Wrong username or password',
        HttpStatus.BAD_REQUEST,
      );
    }
    const passWordConfirmed = await bcrypt.compare(loginDetails.password, user.password);
    if (user && passWordConfirmed) {
      return await this.login(user);
    }

    throw new HttpException(
      'Wrong username or password',
      HttpStatus.BAD_REQUEST,
    );
  }

  private async login(user: User): Promise<any> {
    const payload = { username: user.username, sub: user.user_id};
    return {
      access_token: this.jwtService.sign(payload, {secret: `${process.env.SECRET}`}),
    };
  }
}
