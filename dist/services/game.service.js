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
import { Game } from '../entities/game.entity';
const gameRepository = AppDataSource.getRepository(Game);
const getUserGameStats = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Utiliza el EntityManager para crear una consulta personalizada que obtenga el número total de juegos
    // jugados por el usuario y el número de juegos ganados
    const [{ games, wins }] = yield gameRepository
        .createQueryBuilder('game')
        .select('count(game.id) as games', 'sum(case when game.win = true then 1 else 0 end) as wins')
        .where('game.userId = :userId', { userId })
        .getRawMany();
    return { games, wins };
});
const create = (params) => __awaiter(void 0, void 0, void 0, function* () {
    const item = new Game();
    item.user = params.user;
    item.word = params.word;
    item.attempts = params.attempts;
    item.win = params.win;
    const gameData = yield Game.save(item);
    return gameData;
});
const updateGame = (id, params) => __awaiter(void 0, void 0, void 0, function* () {
    const item = yield Game.findOneBy({ id });
    item.attempts = params.attempts;
    item.win = params.win;
    item.save();
    return item;
});
const getGame = (gameId) => __awaiter(void 0, void 0, void 0, function* () {
    const game = yield Game.findOne({
        relations: {
            word: true,
        },
        where: { id: gameId },
    });
    return game;
});
export default {
    create,
    getUserGameStats,
    getGame,
    updateGame
};
