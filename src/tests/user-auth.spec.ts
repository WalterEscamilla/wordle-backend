import request from 'supertest';
import app from '../app';
import { setupTestDb, closeTestDb } from './test-setup';

beforeAll(async () => {
    await setupTestDb();

});

afterAll(async () => {
    await closeTestDb();
});
describe('User registration and login', () => {
    it('should register a new user', async () => {
        const response = await request(app)
            .post('/users/register')
            .send({
                username: 'testuser',
                email: 'test@example.com',
                password: 'password'
            });
            console.info(response.body);
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty('message', 'User registered successfully');
    });

    it('should log in a registered user', async () => {
        const loginResponse = await request(app)
            .post('/users/login')
            .send({
                email: 'test@example.com',
                password: 'password'
            });

        expect(loginResponse.status).toBe(200);
        expect(loginResponse.body).toHaveProperty('message', 'Logged in successfully');
        expect(loginResponse.body).toHaveProperty('token');

        const token = loginResponse.body.token;

        const protectedResponse = await request(app)
            .get('/api/protected')
            .set('Authorization', `Bearer ${token}`);

        expect(protectedResponse.status).toBe(200);
        expect(protectedResponse.body).toHaveProperty('message', 'Protected route accessed successfully');
    });
});