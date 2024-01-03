export const appMessage = {
    SUCCESS: {
        CREATE_COMPANY_EMPLOYEE_RECORD : {
            statusCode: 200,
            message : 'Employee and company details inserted successfully'
        },
        CREATE_EMPLOYEE_RECORD : {
            statusCode: 200,
            message : 'Employee details inserted successfully'
        },
        DELETE_EMPLOYEE_RECORD : {
            statusCode: 200,
            message : 'Employee details deleted successfully'
        },
        UPDATE_EMPLOYEE_RECORD : {
            statusCode: 200,
            message : 'Employee details updated successfully'
        }
    },
    ERROR :{
        INTERNAL_SERVER_ERROR : {
            statuCode : 500,
            error: 'Internal Server Error'
        },
        ALREADY_EXIST_EMPLOYEE: {
            statusCode: 409,
            error: 'Employee ID Already Exist'
        },
        NOT_FOUND: {
            statusCode: 404,
            error: 'Employee ID Not Found'
        }
    },
    STATUS_CODE : {
        Success: 200,
        BadRequest : 400,
        Not_Found: 404,
        Internal_server_error: 500,
        Already_Exist: 409
    }
}