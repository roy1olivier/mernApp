import request from 'supertest';
import express from 'express';
import router from '../src/routes/data'; // Adjust path as needed

const app = express();
app.use('/', router);

describe('GET /health', () => {
    it('should return 200 and "Server is running"', async () => {
        const res = await request(app).get('/health');
        expect(res.status).toBe(200);
        expect(res.text).toBe('Server is running');
    });
});