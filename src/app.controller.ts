import { Body, Controller, Post } from '@nestjs/common';
import { AuthService } from './auth/auth.service';

export interface LoginDetails {
  username: string;
  password: string;
}

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  @Post('auth/login')
  login(@Body() logins: LoginDetails): any {
    return this.authService.validateUser(logins);
  }
}
