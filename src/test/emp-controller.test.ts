import { Request, Response } from 'express';
import EmployeeRepository from '../repository/employee_repository';
import { createEmployeeValidationSchema, updateEmployeeValidationSchema } from '../validation';
import employeeController from '../controller/employee_controller';
import { appMessage } from '../utils/appMessage';
import { any } from 'joi';

jest.mock('../repository/employee_repository'); // Mock the repository
jest.mock('../validation'); // Mock the validation

// Mock the appMessage module
jest.mock('../utils/appMessage');

const reqBody = {
  "employee": {
    "id": 112,
    "name": "kumaran",
    "level": 8,
    "companyId": 8009,
    "designation": "Mgr",
    "location": "Bengaluru"
  },
  "company": {
    "id": 8009,
    "name": "xyz Inc.",
    "location": "Bengaluru"
  }
}
describe('employeeController', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;

  beforeEach(() => {
    mockRequest = {
      body: reqBody
    };
    mockResponse = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should create employee and company successfully', async () => {
    // Mock the validation result
    const mockValidationResult = { value: any, error: undefined };

    jest.spyOn(createEmployeeValidationSchema, 'validate').mockReturnValueOnce(mockValidationResult);
    // Mock the repository behavior
    jest.spyOn(EmployeeRepository.prototype, 'exitingEmployee').mockResolvedValueOnce(null);
    jest.spyOn(EmployeeRepository.prototype, 'existingCompany').mockResolvedValueOnce(null);
    jest.spyOn(EmployeeRepository.prototype, 'createEmployeeCompany').mockResolvedValueOnce(true);

    await new employeeController().createEmployee(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.Success);
  });

  it('check for existing employee', async () => {
    // Mock the validation result
    const mockValidationResult = { value: any, error: undefined };
    jest.spyOn(createEmployeeValidationSchema, 'validate').mockReturnValueOnce(mockValidationResult);
    // Mock the repository behavior
    jest.spyOn(EmployeeRepository.prototype, 'exitingEmployee').mockResolvedValueOnce(true);
    await new employeeController().createEmployee(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.Already_Exist);
  });

  it('should create employee successfully', async () => {
    // Mock the validation result
    const mockValidationResult = { value: any, error: undefined };
    jest.spyOn(createEmployeeValidationSchema, 'validate').mockReturnValueOnce(mockValidationResult);
    // Mock the repository behavior
    jest.spyOn(EmployeeRepository.prototype, 'exitingEmployee').mockResolvedValueOnce(false);
    jest.spyOn(EmployeeRepository.prototype, 'existingCompany').mockResolvedValueOnce(true);
    jest.spyOn(EmployeeRepository.prototype, 'createEmployee').mockResolvedValueOnce(true);
    await new employeeController().createEmployee(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.Success);
  });


  it('should respond with bad request if createEmployeeCompany fails', async () => {
    // Mock the validation result
    const mockValidationResult = { value: any, error: undefined };
    jest.spyOn(createEmployeeValidationSchema, 'validate').mockReturnValueOnce(mockValidationResult);
    // Mock the repository behavior
    jest.spyOn(EmployeeRepository.prototype, 'exitingEmployee').mockResolvedValueOnce(false);
    jest.spyOn(EmployeeRepository.prototype, 'existingCompany').mockResolvedValueOnce(false);
    jest.spyOn(EmployeeRepository.prototype, 'createEmployeeCompany').mockResolvedValueOnce(false);
    await new employeeController().createEmployee(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.BadRequest);
  });

  it('should send badrequest if validation fails', async () => {
    const mockValidationResult = {
      value: any, error: {
        message: `Invalid input`
      }
    };
    jest.spyOn(createEmployeeValidationSchema, 'validate').mockReturnValueOnce(mockValidationResult as any);
    // Mock the repository behavior
    await new employeeController().createEmployee(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.BadRequest);
  });

  it('should get employee record successfully', async () => {
    // Mock the repository behavior
    mockRequest = {
      params: { "empId": "[104]" }
    };
    jest.spyOn(EmployeeRepository.prototype, 'getEmployeeRecord').mockResolvedValueOnce([104]);
    await new employeeController().getEmployeeRecord(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.Success);
  });

  it('should respond with not found if get the employee record', async () => {
    mockRequest = {
      params: { "empId": "1" }
    };

    // Mock the repository behavior
    jest.spyOn(EmployeeRepository.prototype, 'getEmployeeRecord').mockResolvedValueOnce([]);
    await new employeeController().getEmployeeRecord(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.Not_Found);
  });

  it('should delete employee record successfully', async () => {
    // Mock the repository behavior
    mockRequest = {
      params: { "empId": "[104]" },

    };
    jest.spyOn(EmployeeRepository.prototype, 'deleteEmployeeRecord').mockResolvedValueOnce(true);
    await new employeeController().deleteEmployeeRecord(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.Success);
  });


  it('should respond with not found if delete the employee record', async () => {
    mockRequest = {
      params: { "empId": "1" }
    };
    // Mock the repository behavior
    jest.spyOn(EmployeeRepository.prototype, 'deleteEmployeeRecord').mockResolvedValueOnce(false);
    await new employeeController().deleteEmployeeRecord(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.Not_Found);
  });

  it('should respond with bad request if delete employee record fails', async () => {
    jest.spyOn(EmployeeRepository.prototype, 'deleteEmployeeRecord').mockImplementationOnce(() => {
      throw new Error('Internal Server error');
    });
  });

  it('should update employee successfully', async () => {
    mockRequest = {
      params: { "id": "[104]" },
      body: {
        "employee": {
          "name": "kumaran",
          "level": 8,
          "designation": "Mgr",
          "location": "Bengaluru"
        }
      }
    };
    // Mock the validation result
    const mockValidationResult = { value: any, error: undefined };
    jest.spyOn(createEmployeeValidationSchema, 'validate').mockReturnValueOnce(mockValidationResult);
    // Mock the repository behavior
    jest.spyOn(EmployeeRepository.prototype, 'updateEmployeeRecord').mockResolvedValueOnce(true);
    await new employeeController().updateEmployeeRecord(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.Success);
  });

  it('should respond with id not found', async () => {
    mockRequest = {
      params: { "id": "[104]" },
      body: {
        "employee": {
          "name": "kumaran",
          "level": 8,
          "designation": "Mgr",
          "location": "Bengaluru"
        }
      }
    };
    // Mock the validation result
    const mockValidationResult = { value: any, error: undefined };
    jest.spyOn(createEmployeeValidationSchema, 'validate').mockReturnValueOnce(mockValidationResult);
    // Mock the repository behavior
    jest.spyOn(EmployeeRepository.prototype, 'updateEmployeeRecord').mockResolvedValueOnce(false);
    await new employeeController().updateEmployeeRecord(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.Not_Found);
  });

  it('should send badrequest if validation fails', async () => {
    mockRequest = {
      params: { "id": "[104]" },
      body: {
        "employee": {
          "name": "kumaran",
          "level": 8,
          "designation": "Mgr",
          "location": "Bengaluru"
        }
      }
    };
    const mockValidationResult = {
      value: any, error: {
        message: `Invalid input`
      }
    };
    jest.spyOn(updateEmployeeValidationSchema, 'validate').mockReturnValueOnce(mockValidationResult as any);
    // Mock the repository behavior
    await new employeeController().updateEmployeeRecord(mockRequest as Request, mockResponse as Response);

    expect(mockResponse.status).toHaveBeenCalledWith(appMessage.STATUS_CODE.BadRequest);
  });

  it('should respond with bad request if deleteemployee record fails', async () => {
    mockRequest = {
      params: { "empId": "[104]" },
    };
    jest.spyOn(EmployeeRepository.prototype, 'deleteEmployeeRecord').mockRejectedValueOnce(() => {
      throw new Error('Internal Server error');
    });
    await expect(
      new employeeController().deleteEmployeeRecord(
        mockRequest as Request, mockResponse as Response
      )
    ).rejects.toThrow(new Error('Internal Server Error'));
  });

  it('should respond with bad request if getEmployee record fails', async () => {
    mockRequest = {
      params: { "empId": "[104]" },
    };
    jest.spyOn(EmployeeRepository.prototype, 'getEmployeeRecord').mockRejectedValueOnce(() => {
      throw new Error('Internal Server error');
    });
    await expect(
      new employeeController().getEmployeeRecord(
        mockRequest as Request, mockResponse as Response
      )
    ).rejects.toThrow(new Error('Internal Server Error'));
  });
});
