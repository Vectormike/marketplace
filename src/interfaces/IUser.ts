export interface IUser {
  _id: string;
  name: string;
  email: string;
  password: string;
  phoneNumber: number;
}

export interface IUserInput {
  name: string;
  email: string;
  phoneNumber: string;
  password: string;
}
