import express from 'express';
import httpStatusCodes from 'http-status-codes';

// Services
import userService from '../services/user.service';

// Interfaces
import IRequest from '../interfaces/IRequest';

// Utilities
import ApiResponse from '../utilities/api-response';
import Encryption from '../utilities/encryption';

// Constants
import constants from '../constants';

export default async (
  req: IRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
    console.info('original url',constants.APPLICATION.authorizationIgnorePath.indexOf(`${req.originalUrl}`))
  if (constants.APPLICATION.authorizationIgnorePath.indexOf(`${req.originalUrl}`) === -1) {
    const authorizationHeader = ApiResponse.getCookieFromRequest(req, constants.COOKIE.COOKIE_USER);
    console.info(authorizationHeader)
    if (authorizationHeader) {
      const decoded = await Encryption.verifyCookie(authorizationHeader);

      if (decoded) {
        const user = await userService.getById({ id: decoded.data[constants.COOKIE.KEY_USER_ID] });

        if (user) {
          // @ts-ignore
          req.user = user;
        } else {
          return ApiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
        }
      } else {
        return ApiResponse.error(res, httpStatusCodes.UNAUTHORIZED);
      }
    } else {
      return ApiResponse.error(res, httpStatusCodes.FORBIDDEN);
    }
  }

  next();
};