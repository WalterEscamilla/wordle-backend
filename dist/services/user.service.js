var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppDataSource } from "../db";
import { User } from '../entities/user.entity';
import { Game } from '../entities/game.entity';
import Encryption from '../utilities/encryption';
import { StringError } from '../errors/string.error';
import ApiResponse from '../utilities/api-response';
import DateTimeUtility from '../utilities/date-time';
const userRepository = AppDataSource.getRepository(User);
const create = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const item = new User();
    item.email = params.email;
    item.password = yield Encryption.generateHash(params.password, 10);
    item.firstName = params.firstName;
    item.lastName = params.lastName;
    const userData = yield User.save(item);
    return userData;
});
const login = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User
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
    if (yield Encryption.verifyHash(params.password, user.password)) {
        return ApiResponse.sanitizeUser(user);
    }
    throw new StringError('Your password is not correct');
});
const getById = (params) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const data = yield userRepository.findOneBy({ id: params.id });
        return ApiResponse.sanitizeUser(data);
    }
    catch (e) {
        return null;
    }
});
const update = (params, where) => __awaiter(void 0, void 0, void 0, function* () {
    const query = Object.assign(Object.assign({}, where), { id: params.id });
    const user = yield userRepository.findOneBy(query);
    if (!user) {
        throw new StringError('User is not existed');
    }
    return yield userRepository.update(query, {
        firstName: params.firstName,
        lastName: params.lastName,
        updatedAt: DateTimeUtility.getCurrentTimeStamp(),
    });
});
const list = (params) => __awaiter(void 0, void 0, void 0, function* () {
    let userRepo = userRepository.createQueryBuilder('user');
    userRepo = userRepo.where('user.deletedAt is NULL');
    if (params.keyword) {
        userRepo = userRepo.andWhere('(LOWER(user.firstName) LIKE LOWER(:keyword) OR LOWER(user.lastName) LIKE LOWER(:keyword))', { keyword: `%${params.keyword}%` });
    }
    // Pagination
    const paginationRepo = userRepo;
    const total = yield paginationRepo.getMany();
    const pagRes = ApiResponse.getPagination(total.length, params.limit, params.page);
    userRepo = userRepo.limit(params.limit).offset(ApiResponse.getOffset(params.limit, params.page));
    const users = yield userRepo.getMany();
    const response = [];
    if (users && users.length) {
        for (const item of users) {
            response.push(ApiResponse.sanitizeUser(item));
        }
    }
    return { response, pagination: pagRes.pagination };
});
const remove = (params, where) => __awaiter(void 0, void 0, void 0, function* () {
    const query = Object.assign(Object.assign({}, where), { id: params.id });
    const user = yield userRepository.findOne(query);
    if (!user) {
        throw new StringError('User is not existed');
    }
    return yield userRepository.update(query, {
        deletedAt: DateTimeUtility.getCurrentTimeStamp(),
        updatedAt: DateTimeUtility.getCurrentTimeStamp(),
    });
});
const getTopTenUsersWithMostWins = () => __awaiter(void 0, void 0, void 0, function* () {
    // Utiliza el EntityManager para crear una consulta personalizada que obtenga los usuarios
    // con más juegos ganados, ordenados de manera descendente y limitando el resultado a 10 usuarios
    const users = yield userRepository
        .createQueryBuilder('user')
        .innerJoin(Game, 'game', 'game.userId = user.id')
        .where('game.win = :win', { win: true })
        .groupBy('user.id')
        .orderBy('count(game.id)', 'DESC')
        .take(10)
        .select('user.id, user.name, count(game.id) as wins')
        .getMany();
    return users;
});
export default {
    create,
    login,
    getById,
    update,
    list,
    remove,
    getTopTenUsersWithMostWins
};
