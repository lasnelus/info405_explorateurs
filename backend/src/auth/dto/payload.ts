import { Role } from '@prisma/client';

export type UserPayload = {
  role: Role;
  userId: string;
};
export type RequestWithUser = {
  user: UserPayload;
};
