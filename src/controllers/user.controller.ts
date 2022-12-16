import httpStatusCodes from 'http-status-codes';
import express, { Request, Response} from 'express';
import IUser, { ICreateUser,ILoginUser} from '../interfaces/user.interface';
import userService from '../services/user.service';
import ApiResponse from '../utilities/api-response'
import Encryption from '../utilities/encryption';

import constants from '../constants';
import { StringError } from '../errors/string.error';

class UsersController {
  private path = '/users';
  public router = express.Router();
 
  private users: IUser[] = [
    {
      email: 'walter@escamilla.rocks',
      firstName: 'Walter',
      lastName: 'Escamilla',
    }
  ];
 
  constructor(path: string) {
    this.path = path;
    this.intializeRoutes();
  }
 
  public intializeRoutes() {
    this.router.get(this.path, this.getAllUsers);
    this.router.post(`${this.path}/register`, this.createUser);
    this.router.post(`${this.path}/login`, this.login);

  }
 
  getAllUsers = (request: Request, response: Response) => {
    response.send(this.users);
  }
 
  createUser = async  (request: Request, response: Response) => {
    try {
        console.info(request.body)
        const params: ICreateUser = {
            email: request.body.email,
            password: request.body.password,
            firstName: request.body.firstName,
            lastName: request.body.lastName,
        }
        const user = await userService.create(params);
        return ApiResponse.result(response, user, httpStatusCodes.CREATED);

    } catch (error) {
        if (error.code === constants.ERROR_CODE.DUPLICATED) {
            return ApiResponse.error(response, httpStatusCodes.CONFLICT, 'Email already exists.');
          }
          return ApiResponse.error(response, httpStatusCodes.BAD_REQUEST);        
    }
  }

  login =async  (request: Request, response: Response) => {
    try {
      const params: ILoginUser = {
        email: request.body.email,
        password: request.body.password,
      }
      const user = await userService.login(params);
      const cookie = await this.generateUserCookie(user.id);
      return ApiResponse.result(response, user, httpStatusCodes.OK, cookie);
    } catch (e) {
      if (e instanceof StringError) {
        return ApiResponse.error(response, httpStatusCodes.BAD_REQUEST, e.message);
      }
      return ApiResponse.error(response, httpStatusCodes.BAD_REQUEST, 'Something went wrong');
    }
  }

  generateUserCookie = async (userId: number) => {
    return {
      key: constants.COOKIE.COOKIE_USER,
      value: await Encryption.generateCookie(constants.COOKIE.KEY_USER_ID, userId.toString()),
    };
  };
}
 
export default UsersController;