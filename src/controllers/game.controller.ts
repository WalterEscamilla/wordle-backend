import httpStatusCodes from 'http-status-codes';
import express, { Request, response, Response} from 'express';
import wordService from '../services/word.service'
import constants from '../constants';
import ApiResponse from '../utilities/api-response';
import gameService from '../services/game.service';
import gameDetailService from '../services/game-detail.service';
class GammeController {

  private path = '/game';
  public router = express.Router();

 
  constructor(path: string) {
    this.path = path;
    this.intializeRoutes();
  }
  public intializeRoutes() {
    this.router.post(this.path, this.createGame);
    this.router.post(`${this.path}/word`, this.addWord);


  }

  createGame = async (request, response: Response) => {
    try {
      const word = await wordService.getRandomWord(constants.APPLICATION.wordLengthLimit)
      const params = {
        user: request.user,
        word,
        attempts: 0,
        win:false
      }
      const game = await gameService.create(params);
      return ApiResponse.result(response, game, httpStatusCodes.CREATED);
    } catch (error) {
      console.info(error.message);
      return ApiResponse.error(response, httpStatusCodes.BAD_REQUEST, 'Something went wrong');

    }
  }

  addWord = async (request, response: Response) => {
   try {
    const params = {
      gameId: request.body.gameId,
      userWord: request.body.userWord,
      points: 0,
    };
    const game = await gameService.getGame(params.gameId);
    let result: any  = game;
    const attempts = game.attempts+1;
    if(attempts <= constants.APPLICATION.maxAttempts )
    {
      if(params.userWord === game.word.name) {
        await gameService.updateGame(params.gameId, { attempts, win: true})
      }
      else {
        const compare = this.compareWords(params.userWord, game.word.name)
        params.points = compare.points;
        result = compare.response;
        await gameService.updateGame(params.gameId, { attempts: game.attempts+1, win: false})
        await gameDetailService.create(params, game);
        
      }
      console.info(game)
      return ApiResponse.result(response, result, httpStatusCodes.OK);
    }
    else {

      console.info(game)
      return ApiResponse.error(response, httpStatusCodes.ACCEPTED, 'max attempts for this game');
    }
    
   
    
   } catch (error) {
    console.error(error.message)
    return ApiResponse.error(response, httpStatusCodes.BAD_REQUEST, 'Something went wrong');

   }

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
        value = 1
      } else if (selectedWord.includes(letter)) {
        // Si la letra del usuario está en la palabra seleccionada pero no en la misma posición,
        // agrega la letra con un 2 al resultado y suma 1 intento al usuario
        value = 2;
      } else {
        // Si la letra del usuario no se encuentra en la palabra seleccionada,
        // agrega la letra con un 3 al resultado
        value = 3;
      }
      points += value;
      response.push({value, letter})

    }
    return {points, response}
}
 
}



export default GammeController;
