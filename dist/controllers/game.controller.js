var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import httpStatusCodes from 'http-status-codes';
import express from 'express';
import wordService from '../services/word.service';
import constants from '../constants';
import ApiResponse from '../utilities/api-response';
import gameService from '../services/game.service';
class GammeController {
    constructor(path) {
        this.path = '/game';
        this.router = express.Router();
        this.createGame = (request, response) => __awaiter(this, void 0, void 0, function* () {
            try {
                const word = yield wordService.getRandomWord(constants.APPLICATION.wordLengthLimit);
                const params = {
                    user: request.user,
                    word,
                    attempts: 0,
                    win: false
                };
                const game = yield gameService.create(params);
                return ApiResponse.result(response, game, httpStatusCodes.CREATED);
            }
            catch (error) {
                console.info(error.message);
                return ApiResponse.error(response, httpStatusCodes.BAD_REQUEST, 'Something went wrong');
            }
        });
        this.addWord = (request, response) => __awaiter(this, void 0, void 0, function* () {
            const params = {
                gameId: request.body.gameId,
                userWord: request.body.userWord,
                points: 0
            };
            const game = yield gameService.getGame(params.gameId);
            let result = game;
            if (params.userWord === game.word.name) {
                yield gameService.updateGame(params.gameId, { attempts: game.attempts + 1, win: true });
            }
            else {
                const compare = this.compareWords(params.userWord, game.word.name);
                result = compare.response;
                yield gameService.updateGame(params.gameId, { attempts: game.attempts + 1, win: false });
            }
            console.info(game);
            return ApiResponse.result(response, result, httpStatusCodes.OK);
        });
        this.path = path;
        this.intializeRoutes();
    }
    intializeRoutes() {
        this.router.post(this.path, this.createGame);
        this.router.post(`${this.path}/word`, this.addWord);
    }
    compareWords(userWord, selectedWord) {
        let response = [];
        let points = 0;
        // Recorre cada letra de la palabra del usuario
        for (let i = 0; i < userWord.length; i++) {
            const letter = userWord[i];
            let value = 0;
            // Verifica si la letra del usuario está en la misma posición que la letra seleccionada
            if (letter === selectedWord[i]) {
                // Si la letra está en la misma posición, agrega un 1 al resultado y suma 1 intento al usuario
                value = 1;
            }
            else if (selectedWord.includes(letter)) {
                // Si la letra del usuario está en la palabra seleccionada pero no en la misma posición,
                // agrega la letra con un 2 al resultado y suma 1 intento al usuario
                value = 2;
            }
            else {
                // Si la letra del usuario no se encuentra en la palabra seleccionada,
                // agrega la letra con un 3 al resultado
                value = 3;
            }
            points += value;
            response.push({ value, letter });
        }
        return { points, response };
    }
}
const selectedWords = new Set();
function selectWord() {
    // Selecciona una palabra de cinco letras del diccionario
    let word = selectFiveLetterWordFromDictionary();
    // Verifica si la palabra ya ha sido seleccionada
    while (selectedWords.has(word)) {
        // Si la palabra ya ha sido seleccionada, selecciona otra palabra
        word = selectFiveLetterWordFromDictionary();
    }
    // Agrega la palabra a la lista de palabras seleccionadas
    selectedWords.add(word);
    // Devuelve la palabra seleccionada
    return word;
}
// Ejecuta la función de selección de palabra cada cinco minutos
setInterval(selectWord, 1000 * 60 * 5);
function selectFiveLetterWordFromDictionary() {
    throw new Error("Function not implemented.");
}
export default GammeController;
