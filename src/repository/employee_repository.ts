import { PoolConnection } from 'mysql2/promise';
import { connect } from './db';
import logger from '../../logger';


class EmployeeRepository {
    async createEmployeeCompany(employee: any, company: any) {
        // Get a connection from the pool
        let connection: PoolConnection = await connect();
        try {
            // Begin a transaction
            await connection.beginTransaction();

            // Insert company details
            const companyResult: any = await connection.query(
                'INSERT INTO company (company_id, company_name, company_location) VALUES (?, ?, ?)',
                [company.id, company.name, company.location]
            );

            // Insert employee details
            const employeeResult: any = await connection.query(
                'INSERT INTO employee (emp_id, emp_name, emp_level,company_id,designation, emp_location) VALUES (?, ?, ?, ?, ?, ?)',
                [employee.id, employee.name, employee.level, employee.companyId, employee.designation, employee.location]
            );

            // Commit the transaction if both inserts are successful
            await connection.commit();
            return (companyResult[0].affectedRows && employeeResult[0].affectedRows) ? true : false;
        } catch (error) {
            // Rollback the transaction in case of an error
            await connection.rollback();
            throw error;
        } finally {
            // Release the connection back to the pool
            connection.release();
        }
    }
    async exitingEmployee(empId: number) {
        // Get a connection from the pools
        let connection: PoolConnection = await connect();
        try {
            const checkExistingEmp: any = await connection.query(`SELECT emp_id FROM employee WHERE emp_id = ${empId}`);
            return checkExistingEmp[0][0]?.emp_id ? true : false;
        } catch (error) {
            return error;
        }
    }
    async existingCompany(companyId: number) {
        // Get a connection from the pools
        let connection: PoolConnection = await connect();
        try {
            const checkExistingEmp: any = await connection.query(`SELECT company_id FROM company WHERE company_id = ${companyId}`);
            return checkExistingEmp[0][0]?.company_id ? true : false;
        } catch (error) {
            return error;
        }
    }
    async createEmployee(employee: any) {
        // Get a connection from the pools
        let connection: PoolConnection = await connect();
        try {
            const createEmployee: any = await connection.query('INSERT INTO employee (emp_id, emp_name, emp_level,company_id,designation, emp_location) VALUES (?, ?, ?, ?, ?, ?)',
                [employee.id, employee.name, employee.level, employee.companyId, employee.designation, employee.location]);
            return createEmployee[0].affectedRows ? true : false;
        } catch (error) {
            return error;
        }
    }
    async getEmployeeRecord(empId: number) {
        // Get a connection from the pools
        let connection: PoolConnection = await connect();
        try {
            const getEmployee: any = await connection.query(`
                                                SELECT E.emp_id AS empId
                                            , E.emp_name AS empName
                                            , E.emp_level AS empLevel
                                            , E.company_id AS companyId
                                            , E.designation
                                            , E.emp_location AS empLocation
                                            , C.company_name AS companyName
                                            , C.company_location AS companyLocation
                                            FROM emp.employee E
                                            INNER JOIN emp.company C ON C.company_id = E.company_id
                                            WHERE E.emp_id = ${empId}`);
            return getEmployee[0];
        } catch (error) {
            logger.writeLog('e', 'Error fetching employee record in database', error);
            throw error;
        }
    }
   
    async deleteEmployeeRecord(empId: number) {
        // Get a connection from the pools
        let connection: PoolConnection = await connect();
        try {
            const deleteEmployeeRecord: any = await connection.query(`DELETE FROM employee WHERE emp_id = ${empId}`);
            logger.writeLog('i', `deleted employee id ${empId} record success`, '');
            return deleteEmployeeRecord[0].affectedRows ? true : false;
        } catch (error) {
            logger.writeLog('e', 'Error deletimg employee record in database', error);
            throw error;
        }
    }
    
    async updateEmployeeRecord(employee: any) {
         // Get a connection from the pools
         let connection: PoolConnection = await connect();
        try {
            const updateEmployeeRecord: any = await connection.query(`UPDATE employee SET  emp_name = '${employee.name}', emp_level = ${employee.level}, designation = '${employee.designation}', emp_location= '${employee.location}' WHERE emp_id = ${employee.id}`);
            return updateEmployeeRecord[0].affectedRows ? true : false;
        } catch(error) {
            logger.writeLog('e', 'Error updating employee record in database', error);
            throw error;
        }
    }
}
export default EmployeeRepository;