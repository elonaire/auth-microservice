import { SetMetadata } from '@nestjs/common';

export enum Role {
    User = 'USER',
    Admin = 'ADMIN',
  }

export const ROLES_KEY = 'roles';
export const Roles = (...roles: Role[]): any => SetMetadata(ROLES_KEY, roles);