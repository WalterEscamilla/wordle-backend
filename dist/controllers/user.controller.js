var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import httpStatusCodes from 'http-status-codes';
import express from 'express';
import userService from '../services/user.service';
import ApiResponse from '../utilities/api-response';
import Encryption from '../utilities/encryption';
import constants from '../constants';
import { StringError } from '../errors/string.error';
class UsersController {
    constructor(path) {
        this.path = '/users';
        this.router = express.Router();
        this.users = [
            {
                email: 'walter@escamilla.rocks',
                firstName: 'Walter',
                lastName: 'Escamilla',
            }
        ];
        this.getAllUsers = (request, response) => {
            response.send(this.users);
        };
        this.createUser = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                console.info(request.body);
                const params = {
                    email: request.body.email,
                    password: request.body.password,
                    firstName: request.body.firstName,
                    lastName: request.body.lastName,
                };
                const user = yield userService.create(params);
                return ApiResponse.result(response, user, httpStatusCodes.CREATED);
            }
            catch (error) {
                if (error.code === constants.ERROR_CODE.DUPLICATED) {
                    return ApiResponse.error(response, httpStatusCodes.CONFLICT, 'Email already exists.');
                }
                return ApiResponse.error(response, httpStatusCodes.BAD_REQUEST);
            }
        });
        this.login = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const params = {
                    email: request.body.email,
                    password: request.body.password,
                };
                const user = yield userService.login(params);
                const cookie = yield this.generateUserCookie(user.id);
                return ApiResponse.result(response, user, httpStatusCodes.OK, cookie);
            }
            catch (e) {
                if (e instanceof StringError) {
                    return ApiResponse.error(response, httpStatusCodes.BAD_REQUEST, e.message);
                }
                return ApiResponse.error(response, httpStatusCodes.BAD_REQUEST, 'Something went wrong');
            }
        });
        this.generateUserCookie = (userId) => __awaiter(this, void 0, void 0, function* () {
            return {
                key: constants.COOKIE.COOKIE_USER,
                value: yield Encryption.generateCookie(constants.COOKIE.KEY_USER_ID, userId.toString()),
            };
        });
        this.path = path;
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.get(this.path, this.getAllUsers);
        this.router.post(`${this.path}/register`, this.createUser);
        this.router.post(`${this.path}/login`, this.login);
    }
}
export default UsersController;
