import { AppDataSource } from "../db"

import { User } from '../entities/user.entity';
import { Game } from '../entities/game.entity';

import {
    ICreateUser,
    ILoginUser,
    IUpdateUser,
    IUserQueryParams,

  } from '../interfaces/user.interface';
import Encryption from '../utilities/encryption';
import { StringError } from '../errors/string.error';
import ApiResponse from '../utilities/api-response'
import { IDetailById } from '../interfaces/common.interface';
import DateTimeUtility from '../utilities/date-time';

const userRepository = AppDataSource.getRepository(User);

  const create = async (params: ICreateUser) => {
    const item = new User();
    item.email = params.email;
    item.password =  await Encryption.generateHash(params.password, 10);
    item.firstName = params.firstName;
    item.lastName = params.lastName;
    const userData = await User.save(item);
    return userData;
  };

  const login = async (params: ILoginUser) => {
    const user =  await User
      .createQueryBuilder('user')
      .where('user.email = :email', { email: params.email })
      .select([
        'user.createdAt',
        'user.updatedAt',
        'user.id',
        'user.email',
        'user.password',
        'user.firstName',
        'user.lastName',
      ])
      .getOne();
  
    if (!user) {
      throw new StringError('Your email has not been registered');
    }
  
    if (await Encryption.verifyHash(params.password, user.password)) {
      return ApiResponse.sanitizeUser(user);
    }
  
    throw new StringError('Your password is not correct');
  };
  
  const getById = async (params: IDetailById) => {
    try {
      const data  = await userRepository.findOneBy({ id: params.id })
      return ApiResponse.sanitizeUser(data);
    } catch (e) {
      return null;
    }
  };
 
  
  const update = async (params: IUpdateUser, where: any) => {
    const query = { ...where, id: params.id };
  
    const user = await userRepository.findOneBy(query);
    if (!user) {
      throw new StringError('User is not existed');
    }
  
    return await userRepository.update(query, {
      firstName: params.firstName,
      lastName: params.lastName,
      updatedAt: DateTimeUtility.getCurrentTimeStamp(),
    });
  }
  
  const list = async (params: IUserQueryParams) => {
    let userRepo = userRepository.createQueryBuilder('user');
    userRepo = userRepo.where('user.deletedAt is NULL');
  
    if (params.keyword) {
      userRepo = userRepo.andWhere(
        '(LOWER(user.firstName) LIKE LOWER(:keyword) OR LOWER(user.lastName) LIKE LOWER(:keyword))',
        { keyword: `%${params.keyword}%` },
      );
    }
  
    // Pagination
    const paginationRepo = userRepo;
    const total = await paginationRepo.getMany();
    const pagRes = ApiResponse.getPagination(total.length, params.limit, params.page);
  
    userRepo = userRepo.limit(params.limit).offset(ApiResponse.getOffset(params.limit, params.page));
    const users = await userRepo.getMany();
  
    const response = [];
    if (users && users.length) {
      for (const item of users) {
        response.push(ApiResponse.sanitizeUser(item));
      }
    }
    return { response, pagination: pagRes.pagination };
  };
  
  const remove = async (params: IDetailById, where: any) => {
    const query = { ...where, id: params.id };
  
    const user = await userRepository.findOne(query);
    if (!user) {
      throw new StringError('User is not existed');
    }
  
    return await userRepository.update(query, {
      deletedAt: DateTimeUtility.getCurrentTimeStamp(),
      updatedAt: DateTimeUtility.getCurrentTimeStamp(),
    });
  }
 
    const getTopTenUsersWithMostWins = async (): Promise<User[]> => {
      const users = AppDataSource.query(`SELECT "user"."id", "user"."firstName", count("game"."id") as wins
      FROM "user" "user"
      LEFT JOIN "game" "game" ON "game"."userId"="user"."id" 
      AND ("game"."deletedAt" IS NULL) WHERE ( "game"."win" = TRUE ) 
      AND ( "user"."deletedAt" IS NULL ) GROUP BY "user"."id" ORDER BY count("game"."id") desc
      `)
      // this code give erro typeorm alias game not found, but sql generated is correct
      // const users = await userRepository
      //   .createQueryBuilder('user')
      //   .innerJoin(Game, 'game', 'game.userId = user.id')
      //   .where('game.win = :win', { win: true })
      //   .groupBy('user.id')
      //   .orderBy('count(game.id)', 'DESC')
      //   .take(10)
      //   .select('user.id, user.name, count(game.id) as wins')
      //   .getMany();
  
      return users;
    }
   
  
  export default {
    create,
    login,
    getById,
    update,
    list,
    remove,
    getTopTenUsersWithMostWins
  }