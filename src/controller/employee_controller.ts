import { Request, Response } from "express";
import EmployeeRepository from '../repository/employee_repository';
import { createEmployeeValidationSchema, updateEmployeeValidationSchema } from "../validation";
import { appMessage } from "../utils/appMessage";


class employeeController {
    /** 
     * Create employee from controller with joi validation 
     */
    async createEmployee(req: Request, res: Response) {
        try {
            const isValid = createEmployeeValidationSchema.validate(req.body);
            if (!isValid.error) {
                const { employee, company } = req.body;
                /**Create the object from employee repository */
                let employeeRepo = new EmployeeRepository();
                // check the employee id exist
                let existingEmployee: any = await employeeRepo.exitingEmployee(employee.id);
                if (!existingEmployee) {
                    // check the company id exist
                    let existingCompany: any = await employeeRepo.existingCompany(company.id);
                    if (!existingCompany) {
                        /**Access the repositry member function */
                        const empInserted: any = await employeeRepo.createEmployeeCompany(employee, company);
                        /** if inserted employee and company records into emp DB  */
                        if (empInserted) {
                            res.status(appMessage.STATUS_CODE.Success).json(appMessage.SUCCESS.CREATE_COMPANY_EMPLOYEE_RECORD);
                        } else {
                            res.status(appMessage.STATUS_CODE.BadRequest).json(appMessage.ERROR.INTERNAL_SERVER_ERROR)
                        }
                    } else {
                        const empInserted: any = await employeeRepo.createEmployee(employee);
                        /** if inserted employee and company records into emp DB  */
                        if (empInserted) {
                            res.status(appMessage.STATUS_CODE.Success).json(appMessage.SUCCESS.CREATE_EMPLOYEE_RECORD);
                        }
                    }
                } else {
                    res.status(appMessage.STATUS_CODE.Already_Exist).json(appMessage.ERROR.ALREADY_EXIST_EMPLOYEE);
                }
            } else {
                return res.status(appMessage.STATUS_CODE.BadRequest).json({
                    validationError: {
                        statusCode: appMessage.STATUS_CODE.BadRequest,
                        message: `${isValid.error.details[0].message}`
                    }
                });
            }
            /**If processing with internal server error */
        } catch (error: any) {
            return ({
                statusCode: appMessage.STATUS_CODE.Internal_server_error,
                error: appMessage.ERROR.INTERNAL_SERVER_ERROR
            });
        }
    }

    /** 
     * Get a employee record by employee id 
     */

    async getEmployeeRecord(req: Request, res: Response) {
        try {
            /**Create the object from employee repository */
            let employeeRepo = new EmployeeRepository();
            let getEmployeeRecords: any = await employeeRepo.getEmployeeRecord(+req.params.empId);
            if (getEmployeeRecords.length > 0) {
                res.status(appMessage.STATUS_CODE.Success).json({ statusCode: 200, data: getEmployeeRecords[0] });
            } else {
                res.status(appMessage.STATUS_CODE.Not_Found).json(appMessage.ERROR.NOT_FOUND);
            }
        } catch (error: any) {
            throw new Error('Internal Server Error');
        }

    }

    /** 
     * Delete a employee record using emp Id 
     */
    async deleteEmployeeRecord(req: Request, res: Response) {
        // eslint-disable-next-line no-useless-catch
        try {
            let employeeRepo = new EmployeeRepository();
            let deleteEmployeeRecord: any = await employeeRepo.deleteEmployeeRecord(+req.params.empId);
            if (deleteEmployeeRecord) {
                res.status(appMessage.STATUS_CODE.Success).json(appMessage.SUCCESS.DELETE_EMPLOYEE_RECORD);
            } else {
                res.status(appMessage.STATUS_CODE.Not_Found).json(appMessage.ERROR.NOT_FOUND);
            }
        } catch (error: any) {
            throw new Error('Internal Server Error');
        }
    }

    /** 
     * Update a employee record using emp Id 
     */
    async updateEmployeeRecord(req: Request, res: Response) {
        try {
            req.body.employee.id = +req.params.empId;
            const isValid = updateEmployeeValidationSchema.validate(req.body);
            if (!isValid.error) {
                let employeeRepo = new EmployeeRepository();
                const { employee } = req.body;
                let updateEmployeeRecord: any = await employeeRepo.updateEmployeeRecord(employee);
                if (updateEmployeeRecord) {
                    res.status(appMessage.STATUS_CODE.Success).json(appMessage.SUCCESS.UPDATE_EMPLOYEE_RECORD);
                } else {
                    res.status(appMessage.STATUS_CODE.Not_Found).json(appMessage.ERROR.NOT_FOUND);
                }
            } else {
                return res.status(appMessage.STATUS_CODE.BadRequest).json({
                    validationError: {
                        statusCode: appMessage.STATUS_CODE.BadRequest,
                        message: `${isValid.error.details[0].message}`
                    }
                });
            }
        } catch (error: any) {
            return ({
                statusCode: appMessage.STATUS_CODE.Internal_server_error,
                error: appMessage.ERROR.INTERNAL_SERVER_ERROR
            });
        }
    }
}
export default employeeController;