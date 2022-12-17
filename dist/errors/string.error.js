export class StringError extends Error {
    constructor(message) {
        super();
        this.name = 'StringError';
        this.message = message;
    }
}
