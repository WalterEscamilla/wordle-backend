import UserController from './controllers/user.controller';
import GammeController from './controllers/game.controller';
export const routes = [new UserController('/users'), new GammeController('/games')];
