import { AppDataSource } from "../db"
import {GameDetail} from '../entities/game-detail.entity'
import { Game } from "../entities/game.entity";
import { ICreateGameDetail } from "../interfaces/game.interface";

const gameDetailRepository = AppDataSource.getRepository(GameDetail);

const create = async (params: ICreateGameDetail, game:Game) => {
    const item = new GameDetail();
    item.game =  game;
    item.userWord = params.userWord;
    item.points = params.points;
    const gameDetail = await GameDetail.save(item);
    return gameDetail;
  };


  export default {
    create
  }