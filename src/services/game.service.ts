import { AppDataSource } from "../db"

import { Game } from '../entities/game.entity';
import { ICreateGame, IUpdateGame } from "../interfaces/game.interface";


const gameRepository = AppDataSource.getRepository(Game);

const getUserGameStats = async (userId: number): Promise<{ games: number, wins: number }> => {
    // Utiliza el EntityManager para crear una consulta personalizada que obtenga el número total de juegos
    // jugados por el usuario y el número de juegos ganados
    const [{ games, wins }] = await gameRepository
      .createQueryBuilder('game')
      .select('count(game.id) as games', 'sum(case when game.win = true then 1 else 0 end) as wins')
      .where('game.userId = :userId', { userId })
      .getRawMany();
  
    return { games, wins };
  }

  const create = async (params: ICreateGame) => {
    const item = new Game();
    item.user =  params.user;
    item.word = params.word;
    item.attempts = params.attempts;
    item.win = params.win;
    const gameData = await Game.save(item);
    return gameData;
  };

  const updateGame =  async (id: number, params: IUpdateGame) => {
    const item =await Game.findOneBy({id})
    item.attempts = params.attempts;
    item.win = params.win;
    item.save()
    return item;
  };


  const getGame = async(gameId: number) => {

    const game = await Game.findOne({
      relations: {
          word: true,
      },
      where: { id: gameId},
  })
    return game;
  } 

  export default {
    create,
    getUserGameStats,
    getGame,
    updateGame
  }