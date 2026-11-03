//health test is a simple test to check that the health endpoint is working correctly.

import request from 'supertest';
import { describe, it, expect } from 'vitest';
import { createApp } from '../src/app.js';

describe('health', () => {
    it('should return 200 OK for /health', async () => {
        const app = createApp();
        const response = await request(app).get('/health');
        expect(response.status).toBe(200);
        expect(response.body).toEqual({ status: 'ok' });
    });
    it('hides the x-powered-by header', async () => {
        const app = createApp();
        const response = await request(app).get('/health');
        expect(response.headers["x-powered-by"]).toBeUndefined();
    });

    it('rejects bodies over 10KB with 413', async () => {
        const app = createApp();
        const largeResponse = await request(app).post("/health").set("Content-Type", "application/json").send(JSON.stringify({ padding: "x".repeat(11 *1024)}))
        expect(largeResponse.status).toBe(413);
    });




});
