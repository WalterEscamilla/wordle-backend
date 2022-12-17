import { AppDataSource } from "../db"
import { Word } from '../entities/word.entity';
import { Game } from "../entities/game.entity";

const wordRepository = AppDataSource.getRepository(Word );

const getMostGuessedWords = async (): Promise<Word[]> =>{
  const words = AppDataSource.query(` SELECT "word"."id", "word"."name", 
  count("game"."id") as wins 
  FROM "word" "word" INNER JOIN "game" "game" ON  "game"."wordId" = "word"."id" 
  AND "game"."deletedAt" IS NULL WHERE ( "game"."win" =TRUE ) AND ( "word"."deletedAt" IS NULL ) 
  GROUP BY "word"."id" ORDER BY count("game"."id") DESC `)  
  // const words = await wordRepository
    //   .createQueryBuilder('word')
    //   .innerJoin(Game, 'game', 'game.wordId = word.id')
    //   .where('game.win = TRUE')
    //   .groupBy('word.id')
    //   .orderBy('count(game.id)', 'DESC')
    //   .select('word.id, word.name, count(game.id) as wins')
    //   .getMany();
    console.info(words)
  
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
  