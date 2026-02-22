export const Role = {
  OWNER: 'OWNER',
  INSTRUCTOR: 'INSTRUCTOR',
  GUARDIAN: 'GUARDIAN',
};

export type Role = (typeof Role)[keyof typeof Role];

export type UserPayload = {
  role: Role;
  userId: string;
};

export type RequestWithUser = {
  user: UserPayload;
};
