import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Word } from './word.entity';
import { GameDetail } from './game-detail.entity';
import { MainEntity } from './main.entity';

@Entity()
export class Game  extends MainEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  attempts: number;

  @Column()
  win: boolean;

  @ManyToOne(type => User, user => user.games)
  user: User;

  @ManyToOne(type => Word, word => word.games)
  word: Word;

  @OneToMany(type => GameDetail, gameDetail => gameDetail.game)
  gameDetails: GameDetail[];
}