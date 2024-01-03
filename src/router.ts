import { Router} from 'express';
import  employeeController  from '../src/controller/employee_controller';
const router = Router();
let empDetails = new employeeController();
/** route to controller for create employee*/
router.post('/createEmployeeRecord', empDetails.createEmployee);
router.get('/getEmployeeRecord/:empId', empDetails.getEmployeeRecord);
router.delete('/deleteEmployeeRecord/:empId', empDetails.deleteEmployeeRecord);
router.put('/updateEmployeeRecord/:empId', empDetails.updateEmployeeRecord);
export default router;