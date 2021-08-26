import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { LoginDetails } from './app.entity';
import { JwtAuthGuard } from './auth/auth.guard';
import { AuthService } from './auth/auth.service';

@Controller()
export class AppController {
  constructor(private readonly authService: AuthService) {}

  // End point to authenticate a user
  @Post('auth/login')
  login(@Body() logins: LoginDetails): any {
    return this.authService.validateUser(logins);
  }

  @UseGuards(JwtAuthGuard)
  @Get('auth/confirm')
  confirmAuth(): any {
    return {
      message: 'OK'
    }
  }
}
