import { Sequelize } from 'sequelize-typescript';
import { Role, User, UserRole } from '../users/user.entity';

export const databaseProviders = [
  {
    provide: 'SEQUELIZE',
    useFactory: async (): Promise<Sequelize> => {
      const sequelize = new Sequelize({
        dialect: 'postgres',
        host: '127.0.0.1',
        port: 5432,
        username: 'elonaire',
        password: 'Asenekatenka_95!?',
        database: 'auth_db',
      });
      sequelize.addModels([User, Role, UserRole]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
