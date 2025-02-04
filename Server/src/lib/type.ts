import { Request } from "express";
import { Types } from "mongoose";

// interface IUser {
//   name: string;
//   email: string;
//   id: string;
//   sub?: string;
//   username: string;
//   interest: string[];
//   provider: string;
// }

export interface Token {
  name: string;
  email: string;
  sub: string;
  id: string;
  username: string;
  interest: string[];
  provider: string;
  iat: number;
  exp: number;
  jti: string;
}

export interface IUserToken {
  name: string;
  email: string;
  id: string | Types.ObjectId;
  username: string;
  interest: string[];
  provider: string;
}

export interface AuthenticatedRequest extends Request {
  user?: IUserToken; // Change the type based on the actual structure of the token
  //   user: IUser;
}
