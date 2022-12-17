const basePath = '/';

export default {
  url: {
    basePath,
  },
  wordLengthLimit : 5,
  maxAttempts: 5,
  maxTimeLifeGame:300, //seconds 
  timers: {
    userCookieExpiry: '720h',
  },
  env: {
    authSecret: process.env.TOKEN_SECRET_KEY || 'test',
  },
  authorizationIgnorePath: [
    '/',
    '/users/login',
    '/users/register',
  ],
};