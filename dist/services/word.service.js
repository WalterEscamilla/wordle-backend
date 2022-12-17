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
import { Word } from '../entities/word.entity';
import { Game } from "../entities/game.entity";
const wordRepository = AppDataSource.getRepository(Word);
const getMostGuessedWords = () => __awaiter(void 0, void 0, void 0, function* () {
    const words = yield wordRepository
        .createQueryBuilder('word')
        .innerJoin(Game, 'game', 'game.wordId = word.id')
        .where('game.win = :win', { win: true })
        .groupBy('word.id')
        .orderBy('count(game.id)', 'DESC')
        .select('word.id, word.name, count(game.id) as wins')
        .getMany();
    return words;
});
const getRandomWord = (length) => __awaiter(void 0, void 0, void 0, function* () {
    const totalWords = yield wordRepository
        .createQueryBuilder()
        .select('COUNT(*)')
        .where('LENGTH(name) = :length', { length: length })
        .getRawOne();
    const randomIndex = Math.floor(Math.random() * (totalWords.count - 0));
    console.info({ randomIndex });
    const word = wordRepository.createQueryBuilder()
        .where('LENGTH(name) = :length', { length: 5 })
        .offset(randomIndex)
        .limit(1)
        .getOne();
    return word;
});
export default {
    getMostGuessedWords,
    getRandomWord
};
