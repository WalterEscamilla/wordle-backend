var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Column, Entity, PrimaryGeneratedColumn, Unique, OneToMany } from 'typeorm';
import { Game } from './game.entity';
// Entities
import { MainEntity } from './main.entity';
let Word = class Word extends MainEntity {
};
__decorate([
    PrimaryGeneratedColumn({ type: 'int' }),
    __metadata("design:type", Number)
], Word.prototype, "id", void 0);
__decorate([
    Column({ length: 100, nullable: false }),
    Unique(['name']),
    __metadata("design:type", String)
], Word.prototype, "name", void 0);
__decorate([
    OneToMany(type => Game, game => game.word),
    __metadata("design:type", Array)
], Word.prototype, "games", void 0);
Word = __decorate([
    Entity('word')
], Word);
export { Word };
