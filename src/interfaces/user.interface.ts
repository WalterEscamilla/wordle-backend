import { IBaseQueryParams } from './common.interface';

interface IUser {
    email: string;
    firstName: string;
    lastName: string;
  }

  export interface ICreateUser {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }

  export interface ILoginUser {
    email: string;
    password: string;
  }
  
  export interface IUpdateUser {
    id: number;
    firstName: string;
    lastName: string;
  }

  export interface IUserQueryParams  extends IBaseQueryParams{
    keyword?: string;
  }
  export default IUser;