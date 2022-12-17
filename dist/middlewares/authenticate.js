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
// Services
import userService from '../services/user.service';
// Utilities
import ApiResponse from '../utilities/api-response';
import Encryption from '../utilities/encryption';
// Constants
import constants from '../constants';
export default (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.info('original url', constants.APPLICATION.authorizationIgnorePath.indexOf(`${req.originalUrl}`));
    if (constants.APPLICATION.authorizationIgnorePath.indexOf(`${req.originalUrl}`) === -1) {
        const authorizationHeader = ApiResponse.getCookieFromRequest(req, constants.COOKIE.COOKIE_USER);
        console.info(authorizationHeader);
        if (authorizationHeader) {
            const decoded = yield Encryption.verifyCookie(authorizationHeader);
            if (decoded) {
                const user = yield userService.getById({ id: decoded.data[constants.COOKIE.KEY_USER_ID] });
                if (user) {
                    // @ts-ignore
                    req.user = user;
                }
                else {
                    return ApiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
                }
            }
            else {
                return ApiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
            }
        }
        else {
            return ApiResponse.error(res, httpStatusCodes.FORBIDDEN);
        }
    }
    next();
});
