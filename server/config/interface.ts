import { Document } from "mongoose";

export interface INEWUSER {
  first_name: string;
  last_name: string;
  password: string;
  account: string;
}
export interface ITOKEN {
  newUser?: INEWUSER;
  iat: number;
  exp: number;
}

export interface IUSER extends Document {
  first_name: string;
  last_name: string;
  password: string;
  avatar?: string;
  account?: string;
  role: string;
  _id: Object;
}
