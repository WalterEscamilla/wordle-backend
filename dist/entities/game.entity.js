var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, ManyToOne } from 'typeorm';
import { User } from './user.entity';
import { Word } from './word.entity';
import { GameDetail } from './game-detail.entity';
import { MainEntity } from './main.entity';
let Game = class Game extends MainEntity {
};
__decorate([
    PrimaryGeneratedColumn(),
    __metadata("design:type", Number)
], Game.prototype, "id", void 0);
__decorate([
    Column(),
    __metadata("design:type", Number)
], Game.prototype, "attempts", void 0);
__decorate([
    Column(),
    __metadata("design:type", Boolean)
], Game.prototype, "win", void 0);
__decorate([
    ManyToOne(type => User, user => user.games),
    __metadata("design:type", User)
], Game.prototype, "user", void 0);
__decorate([
    ManyToOne(type => Word, word => word.games),
    __metadata("design:type", Word)
], Game.prototype, "word", void 0);
__decorate([
    OneToMany(type => GameDetail, gameDetail => gameDetail.game),
    __metadata("design:type", Array)
], Game.prototype, "gameDetails", void 0);
Game = __decorate([
    Entity()
], Game);
export { Game };
