export interface IUSER {
  first_name: string;
  last_name: string;
  password: string;
  account: string;
}
export interface ITOKEN {
  newUser: IUSER;
  iat: number;
  exp: number;
}
