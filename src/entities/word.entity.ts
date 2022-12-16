import { Column, Entity, PrimaryGeneratedColumn, Unique,OneToMany } from 'typeorm';
import { Game } from './game.entity';

// Entities
import { MainEntity } from './main.entity';

@Entity('word')
export class Word extends MainEntity {

  @PrimaryGeneratedColumn({ type: 'int' })
  id: number;

  @Column({ length: 100, nullable: false })
  @Unique(['name'])
  name: string;

  @OneToMany(type => Game, game => game.word)
  games: Game[];

}