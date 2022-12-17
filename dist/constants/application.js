const basePath = '/';
export default {
    url: {
        basePath,
    },
    wordLengthLimit: 5,
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
