import { AppDataSource } from "../db"

import { MigrationInterface, QueryRunner } from "typeorm"
import { getWords } from "../utilities/get-words";
import { Word } from '../entities/word.entity';

export class inserInitalWords1671159242816 implements MigrationInterface {

  public async up(queryRunner: QueryRunner): Promise<void> {
   
    const words = getWords();
    for (const line of words) {
      const word = new Word();
      word.name = line;
      await word.save();
    }

  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.clearTable('word');
  }

}
