
  import { User } from "../entities/user.entity";
  import { Word } from "../entities/word.entity";
  import { Game } from "../entities/game.entity";
  export interface ICreateGame {
    user: User;
    word: Word;
    attempts: number;
    win: boolean;
  }

  export interface IUpdateGame {
    attempts: number;
    win: boolean;
  }

  export interface ICreateGameDetail {
    gameId: number;
    userWord: string;
    points: number;
  }