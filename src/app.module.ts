import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { SequelizeModule } from '@nestjs/sequelize';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    UsersModule,
    SequelizeModule.forRoot({
      dialect: 'postgres',
      host: '127.0.0.1',
      port: 5432,
      username: 'elonaire',
      password: 'Asenekatenka_95!?',
      database: 'auth_db',
      models: [],
    }),
    AuthModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
