import { AppDataSource } from "../db"
import { Word } from '../entities/word.entity';
import { Game } from "../entities/game.entity";

const wordRepository = AppDataSource.getRepository(Word );

const getMostGuessedWords = async (): Promise<Word[]> =>{
    const words = await wordRepository
      .createQueryBuilder('word')
      .innerJoin(Game, 'game', 'game.wordId = word.id')
      .where('game.win = :win', { win: true })
      .groupBy('word.id')
      .orderBy('count(game.id)', 'DESC')
      .select('word.id, word.name, count(game.id) as wins')
      .getMany();
  
    return words;
  }

  

const getRandomWord = async (length:number):Promise<Word> => {

  const totalWords = await wordRepository
  .createQueryBuilder()
  .select('COUNT(*)')
  .where('LENGTH(name) = :length', { length: length})
  .getRawOne();
  const randomIndex =   Math.floor(Math.random() * (totalWords.count - 0));
  console.info({randomIndex})

  const word = wordRepository.createQueryBuilder()
  .where('LENGTH(name) = :length', { length: 5 })
  .offset(randomIndex)
  .limit(1)
  .getOne();

  return word

}

       

  export default {
    getMostGuessedWords,
    getRandomWord
  }
  