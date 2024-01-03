import request from 'supertest';
import app from '../app';
import logger from '../../logger';

// Mock the logger module
jest.mock('../../logger', () => ({
  writeLog: jest.fn(),
}));

// Mock the process.env object
const originalEnv = process.env;
process.env = {
  ...originalEnv,
  PORT: '3000', // Set the mocked PORT value
};

describe('Emp App', ( )=> {
  it('should return a welcome message for the root route', async () => {
    const response = await request(app).get('/');
    expect(response.status).toBe(404);
    expect(logger.writeLog).toHaveBeenCalledWith('i', expect.stringContaining(`Server is running on http://localhost:8080`), '');
  });
});
afterAll(() => {
  process.env = originalEnv;
});
