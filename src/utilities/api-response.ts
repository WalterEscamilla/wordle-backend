import { Response,Request } from 'express';
import httpStatusCodes from 'http-status-codes';
import { IOverrideRequest,IPagination,ICookie } from '../interfaces/common.interface';
import { MainEntity } from '../entities/main.entity';
import { User } from '../entities/user.entity';

// Interfaces

// Errors
import { StringError } from '../errors/string.error';

export default class ApiResponse {
    static result = (
        res: Response,
        data: object,
        status: number = 200,
        cookie: ICookie = null,

    ) => {
        res.status(status);
        if (cookie) {
          res.cookie(cookie.key, cookie.value);
        }
        let responseData: any = { data, success: true };

        res.json(responseData);
    };

    static error = (
        res: Response,
        status: number = 400,
        error: string = httpStatusCodes.getStatusText(status),
        override: IOverrideRequest = null,
    ) => {
        res.status(status).json({
            override,
            error: {
                message: error,
            },
            success: false,
        });
    };


    static exception(res: any, error: any) {
        if (error instanceof StringError) {
            return ApiResponse.error(res, httpStatusCodes.BAD_REQUEST, error.message);
        }
        return ApiResponse.error(res, httpStatusCodes.BAD_REQUEST, 'Something went wrong');
    }

    static sanitizeData(data: MainEntity) {
        const { createdAt, updatedAt, deletedAt, ...basicData } = data;
        return basicData;
      }
    
      static sanitizeUser(user: User) {
        const { password, deletedAt, ...basicUser } = user;
        return basicUser;
      }
      static getQueryParam(req: any, type: string) {
        if (req && type && type !== '') {
          switch (type) {
            case 'limit': {
              return req.query.limit ? parseInt(req.query.limit.toString(), 10) : 5;
            }
            case 'page': {
              return req.query.page ? parseInt(req.query.page.toString(), 10) : 1;
            }
            default: {
              return req.query[type] ? req.query[type] : null;
            }
          }
        }
        return null;
      }
    
      static getOffset(limit: number, page: number) {
        return limit * page - limit;
      }
    
      static getPagination(total: number, limit: number, currentPage: number) {
        if (total) {
          const pagination: IPagination = {
            currentPage,
            totalPages: Math.ceil(total / limit),
            previousPage: currentPage <= 1 ? null : currentPage - 1,
            nextPage: total - (currentPage * limit) > 0 ? currentPage + 1 : null,
            totalItems: total,
          };
          return { pagination };
        }
        return { pagination: null };
      }
      static getCookieFromRequest(req: Request, key: string) {
        if (req.headers.authorization) {
          return req.headers.authorization;
        }
    
        if (req.headers.cookie) {
          const results = req.headers.cookie.split(';');
          const filtered = results.filter((result: string) => {
            return result.startsWith(`${key}=`);
          });
    
          if (filtered.length > 0) {
            return filtered[0].split('=')[1];
          }
        }
    
        return null;
      }
}