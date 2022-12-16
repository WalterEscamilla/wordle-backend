import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Game } from './game.entity';
import { MainEntity } from './main.entity';

@Entity('game_detail')
export class GameDetail extends MainEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userWord: string;

  @Column()
  points: number;

  @ManyToOne(type => Game, game => game.gameDetails)
  game: Game;
}