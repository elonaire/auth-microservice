import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { DatabaseModule } from './database/database.module';
import { JwtModule } from '@nestjs/jwt';
import { usersProviders } from './users/user.providers';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    UsersModule,
    AuthModule,
    DatabaseModule,
    JwtModule.register({
      secret: `${process.env.SECRET}`,
      signOptions: { expiresIn: '1h' },
    }),
    ConfigModule.forRoot()
  ],
  controllers: [AppController],
  providers: [AppService, ...usersProviders],
  // exports: [JwtModule]
})
export class AppModule {}
