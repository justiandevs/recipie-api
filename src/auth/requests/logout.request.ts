import { Request } from 'express';

interface User {
  sub: number;
  refreshToken: string;
}

export interface LogoutRequest extends Request {
  user: User;
}
