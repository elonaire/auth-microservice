import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { usersProviders } from '../users/user.providers';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

@Module({
  imports: [JwtModule.register({
    secret: 'IDontPlayBoyIaintHughHuffner',
    signOptions: { expiresIn: '60s' },
  })],
  providers: [AuthService, UsersService, ...usersProviders]
})
export class AuthModule {}
