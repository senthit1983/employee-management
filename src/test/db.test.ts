import mysql, { Pool, PoolConnection } from 'mysql2/promise';
import * as db from '../repository/db';
import logger from '../../logger';

// Mock the logger module
jest.mock('../../logger');

jest.mock('../repository/db')

// Mock the mysql2/promise module
jest.mock('mysql2/promise', () => {
    const mockPool: Pool = {
      getConnection: jest.fn(),
    } as unknown as Pool;
    return {
      createPool: jest.fn(() => mockPool),
    };
  });

describe('connect function', () => {
  let mockPool: Pool;

  beforeEach(() => {
    // Clear the mock calls and create a new mock pool before each test
    jest.clearAllMocks();
    mockPool = {
      getConnection: jest.fn(),
    } as unknown as Pool;
    (mysql.createPool as jest.Mock).mockReturnValue(mockPool);
  });

  it('should connect to the database successfully', async () => {
    // Mock the getConnection function to resolve with a mock connection
    const mockConnection: PoolConnection = {} as PoolConnection;
    (mysql.createPool as jest.Mock).mockReturnValueOnce({
        getConnection: jest.fn().mockResolvedValueOnce(mockConnection),
      });
      jest.spyOn(db, 'connect').mockImplementationOnce(()=>{
        logger.writeLog('i', 'Connected to the database', '');
        return Promise.resolve(mockConnection)
    })
    // Call the connect function
    const connection = await db.connect();
      
    expect(connection).toBe(mockConnection);
  });

  it('should throw an error if connection fails', async () => {
    // Mock the getConnection function to reject with an error
    const mockError = new Error('Connection error');
    jest.spyOn(db, 'connect').mockRejectedValueOnce(()=>{
        logger.writeLog('e', 'Error connecting to the database:', mockError);
        throw mockError
    })

    // Call the connect function
    await expect(db.connect()).rejects.toThrow(mockError);

    // Assertions
    expect(logger.writeLog).toHaveBeenCalledWith('e', 'Error connecting to the database:', mockError);
  });
});

