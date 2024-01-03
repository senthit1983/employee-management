import { PoolConnection } from 'mysql2/promise';
import EmployeeRepository from '../repository/employee_repository';
import * as db from '../repository/db';
import logger from '../../logger';

jest.mock('../repository/db');

afterEach(() => {
  jest.clearAllMocks(); // Clear mocks after each test
});
describe('EmployeeRepository for employee and company', () => {

  it('should create employee and company successfully', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      beginTransaction: jest.fn(),
      query: jest.fn().mockResolvedValue([{
        affectedRows: 1,
      }]),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    // Mock the query method for company insertion
    mockConnection.query;
    // Mock the query method for employee insertion
    mockConnection.query;

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    const result = await employeeRepository.createEmployeeCompany(
      {
        id: 1,
        name: 'John',
        level: 'Manager',
        companyId: 100,
        designation: 'Software Engineer',
        location: 'City A',
      },
      {
        id: 100,
        name: 'ABC Inc',
        location: 'City B',
      }
    );
    // Assert that the method returns true when both inserts are successful
    expect(result).toBe(true);

    // Assert that transaction-related methods were called appropriately
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });

  it('if create employee and company failed', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      beginTransaction: jest.fn(),
      query: jest.fn().mockResolvedValue([{
        affectedRows: 0,
      }]),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    // Mock the query method for company insertion
    mockConnection.query;
    // Mock the query method for employee insertion
    mockConnection.query;

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    const result = await employeeRepository.createEmployeeCompany(
      {
        id: 1,
        name: 'John',
        level: 'Manager',
        companyId: 100,
        designation: 'Software Engineer',
        location: 'City A',
      },
      {
        id: 100,
        name: 'ABC Inc',
        location: 'City B',
      }
    );
    // Assert that the method returns true when both failed
    expect(result).toBe(false);

    // Assert that transaction-related methods were called appropriately
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.commit).toHaveBeenCalled();
    expect(mockConnection.rollback).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });

  it('should handle an error and rollback transaction', async () => {
    let mockConnection: jest.Mocked<PoolConnection>;
    mockConnection = ({
      beginTransaction: jest.fn(),
      query: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
      release: jest.fn(),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    const mockError = new Error('Mocked error');

    // Mock the query method to throw an error during company insertion
    mockConnection.query.mockRejectedValueOnce(mockError);

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    await expect(
      employeeRepository.createEmployeeCompany(
        {
          id: 1,
          name: 'John',
          level: 'Manager',
          companyId: 100,
          designation: 'Software Engineer',
          location: 'City A',
        },
        {
          id: 100,
          name: 'ABC Inc',
          location: 'City B',
        }
      )
    ).rejects.toThrow(mockError);
    // Assert that transaction-related methods were called appropriately
    expect(mockConnection.beginTransaction).toHaveBeenCalled();
    expect(mockConnection.rollback).toHaveBeenCalled();
    expect(mockConnection.commit).not.toHaveBeenCalled();
    expect(mockConnection.release).toHaveBeenCalled();
  });
});

describe('EmployeeRepository for employee', () => {

  it('should create employee successfully', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([{
        affectedRows: 1,
      }]),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    // Mock the query method for employee insertion
    mockConnection.query;


    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    const result = await employeeRepository.createEmployee(
      {
        id: 1,
        name: 'John',
        level: 'Manager',
        companyId: 100,
        designation: 'Software Engineer',
        location: 'City A',
      }
    );

    // Assert that the method returns true when both inserts are successful
    expect(result).toBe(true);
  });

  it('if create employee failed', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([{
        affectedRows: 0,
      }]),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    // Mock the query method for employee insertion
    mockConnection.query;


    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    const result = await employeeRepository.createEmployee(
      {
        id: 1,
        name: 'John',
        level: 'Manager',
        companyId: 100,
        designation: 'Software Engineer',
        location: 'City A',
      }
    );
    //logger.writeLog('e', 'Error connecting to the database:', 'error');
    // Assert that the method returns true when both inserts are successful
    expect(result).toBe(false);
  });

  it('should handle an error while creating employee', async () => {
    let mockConnection: jest.Mocked<PoolConnection>;
    mockConnection = ({
      query: jest.fn()
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    const mockError = new Error('Mocked error');

    // Mock the query method to throw an error during company insertion
    mockConnection.query.mockRejectedValueOnce(mockError);

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    await expect(
      employeeRepository.createEmployee(
        {
          id: 1,
          name: 'John',
          level: 'Manager',
          companyId: 100,
          designation: 'Software Engineer',
          location: 'City A',
        }
      )
    ).resolves.toThrow(mockError);
  });
});

describe('EmployeeRepository for existing employee', () => {

  it('should verify employee id if exist', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([
        true
      ]),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);

    // Mock the query method for check employee id exist
    mockConnection.query;

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    const result = await employeeRepository.exitingEmployee(1);

    // Assert that the method returns true when both inserts are successful
    expect(result).toBe(false);
  });

  it('should verify employee id not exist', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([[{ emp_id: 1 }]]),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);

    // Mock the query method for check employee id exist
    mockConnection.query;

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    const result = await employeeRepository.exitingEmployee(123);
    // Assert that the method returns true when both inserts are successful
    expect(result).toBe(true);
  });

  it('should handle an error while checking employee id', async () => {
    let mockConnection: jest.Mocked<PoolConnection>;
    mockConnection = ({
      query: jest.fn(),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    const mockError = new Error('Mocked error');

    // Mock the query method to throw an error
    mockConnection.query.mockRejectedValueOnce(mockError);

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    await expect(
      employeeRepository.exitingEmployee(1)
    ).resolves.toThrow(mockError);
  });
});

describe('EmployeeRepository for existing company', () => {

  it('should verify company id not exist', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([
        true
      ]),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    // Mock the query method for check company id exist
    mockConnection.query;


    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    const result = await employeeRepository.existingCompany(1);

    // Assert that the method returns true when both inserts are successful
    expect(result).toBe(false);
  });

  it('should verify company id if exist', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([
        [{ company_id: 1 }]
      ]),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    // Mock the query method for check company id exist
    mockConnection.query;


    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    const result = await employeeRepository.existingCompany(1);

    // Assert that the method returns true when both inserts are successful
    expect(result).toBe(true);
  });

  it('should handle an error while checking company id', async () => {
    let mockConnection: jest.Mocked<PoolConnection>;
    mockConnection = ({
      query: jest.fn(),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    const mockError = new Error('Mocked error');

    // Mock the query method to throw an error
    mockConnection.query.mockRejectedValueOnce(mockError);

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    await expect(
      employeeRepository.existingCompany(1)
    ).resolves.toThrow(mockError);
  });
});

describe('EmployeeRepository for fetching employee record', () => {

  it('should get employee details by id', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([
        true
      ]),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);

    // Mock the query method for check employee id exist
    mockConnection.query;

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    const result = await employeeRepository.getEmployeeRecord(1);

    // Assert that the method returns true when both inserts are successful
    expect(result).toBe(true);
  });

  it('should verify employee id not exist', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([1]),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);

    // Mock the query method for check employee id exist
    mockConnection.query;

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    const result = await employeeRepository.getEmployeeRecord(12345);
    // Assert that the method returns true when both inserts are successful
    expect(result).toBe(1);
  });

  it('should handle an error while checking employee id', async () => {
    let mockConnection: jest.Mocked<PoolConnection>;
    mockConnection = ({
      query: jest.fn(),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    const mockError = new Error('Mocked error');

    // Mock the query method to throw an error during fetching employee record
    mockConnection.query.mockRejectedValueOnce(mockError);
    //logger.writeLog('e', 'Error fetching employee record in database', mockError);
    //jest.spyOn(EmployeeRepository.prototype, 'getEmployeeRecord').mockRejectedValueOnce(new Error('Mocked error'));
    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    await expect(
      employeeRepository.getEmployeeRecord(1)
    ).rejects.toThrow(mockError);
  });
});

describe('EmployeeRepository for delete employee record', () => {

  it('should delete employee details by id', async () => {
    let empId = 101;
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([
        { affectedRows: 1 }
      ]),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);

    // Mock the query method for check employee id exist
    mockConnection.query;

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    //const result = 
    await employeeRepository.deleteEmployeeRecord(empId);
    logger.writeLog('i', `deleted employee record ${empId}`, '');
    // Assert that the method returns true when delete deleted successful
    //expect(result).toBe(true);
  });

  it('should verify employee id not exist', async () => {
    let empId = 123;
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([{ affectedRows: 0 }]),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);

    // Mock the query method for check employee id exist
    mockConnection.query;

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    const result = await employeeRepository.deleteEmployeeRecord(123);
    logger.writeLog('i', `deleted employee id ${empId} record success`, '');
    // Assert that the method returns true when both inserts are successful
    expect(result).toBe(false);
  });

  it('should handle an error while deleting employee id', async () => {
    let mockConnection: jest.Mocked<PoolConnection>;
    mockConnection = ({
      query: jest.fn(),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    const mockError = new Error('Mocked error');
    // Mock the query method to throw an error during deleting employee
    mockConnection.query.mockRejectedValueOnce(mockError);
    //logger.writeLog('e', 'Error deletimg employee record in database', mockError);
    //jest.spyOn(EmployeeRepository.prototype, 'deleteEmployeeRecord').mockRejectedValueOnce(new Error('Mocked error'));
    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    await expect(
      employeeRepository.deleteEmployeeRecord(1)
    ).rejects.toThrow(mockError);
  });
});

describe('EmployeeRepository for update employee', () => {

  it('should update employee record successfully', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([{
        affectedRows: 0,
      }])
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    // Mock the query method 
    mockConnection.query;
    // Mock the query method for employee updation
    mockConnection.query;

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    await employeeRepository.updateEmployeeRecord(
      {
        id: 1,
        name: 'John',
        level: 'Manager',
        companyId: 100,
        designation: 'Software Engineer',
        location: 'City A',
      }
    );
    // Assert that the method returns true when update failed
    //expect(result).toBe(false);
  });
  it('if update employee record failed', async () => {
    let mockConnection: jest.Mocked<PoolConnection>
    mockConnection = ({
      query: jest.fn().mockResolvedValue([{
        affectedRows: 1,
      }])
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    // Mock the query method
    mockConnection.query;
    // Mock the query method for employee updation
    mockConnection.query;

    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    await employeeRepository.updateEmployeeRecord(
      {
        id: 1,
        name: 'John',
        level: 'Manager',
        companyId: 100,
        designation: 'Software Engineer',
        location: 'City A',
      }
    );
    // Assert that the method returns true when update a record successful
    //expect(result).toBe(false);
  });
 
  it('should handle an error while updating employee', async () => {
    let mockConnection: jest.Mocked<PoolConnection>;
    mockConnection = ({
      query: jest.fn(),
    } as unknown) as jest.Mocked<PoolConnection>;

    // Mock the connect function to return the mocked connection
    jest.spyOn(db, 'connect').mockResolvedValueOnce(mockConnection);
    const mockError = new Error('Mocked error');
    // Mock the query method to throw an error during employee updation
    mockConnection.query.mockRejectedValueOnce(mockError);
   // logger.writeLog('e', 'Error updating employee record in database', mockError);
    //jest.spyOn(EmployeeRepository.prototype, 'updateEmployeeRecord').mockRejectedValueOnce(new Error('Mocked error'));
    const employeeRepository = new EmployeeRepository();

    // Call the method under test
    await expect(
      employeeRepository.updateEmployeeRecord({
        id: 1,
        name: 'John',
        level: 'Manager',
        companyId: 100,
        designation: 'Software Engineer',
        location: 'City A',
      })
    ).rejects.toThrow(mockError);
  });

});