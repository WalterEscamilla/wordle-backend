
  import { User } from "../entities/user.entity";
  import { Word } from "../entities/word.entity";
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
