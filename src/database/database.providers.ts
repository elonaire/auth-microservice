import { Sequelize } from 'sequelize-typescript';
import { SEQUELIZE } from '../constants';
import { Role, User, UserRole } from '../users/user.entity';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async (): Promise<Sequelize> => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: process.env.DATABASE_HOST,
        port: parseInt(process.env.DATABASE_PORT),
        username: process.env.DATABASE_USER,
        password: process.env.DATABASE_PWD,
        database: process.env.DATABASE,
      });
      sequelize.addModels([User, Role, UserRole]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
