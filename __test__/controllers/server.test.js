const request = require('supertest');
const { StatusCodes } = require('http-status-codes');
const { app, server } = require('../../server');

afterAll((done) => {
  if (server) {
    server.close(done); // Cierra el servidor después de las pruebas
  } else {
    done();
  }
});

describe('Server Tests', () => {
  it('should return API status and welcome message on GET /', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(StatusCodes.OK);
    expect(response.text).toContain('API is running');
    expect(response.text).toContain('Welcome to the Wildlife Observation API');
  });

  it('should handle internal server errors and return status 500', async () => {
    const response = await request(app).get('/test-error');
    expect(response.status).toBe(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body).toHaveProperty('message');
    expect(response.body.message).toContain('Something went wrong');
    expect(response.body).toHaveProperty('error', 'Simulated Internal Error');
  });
});
