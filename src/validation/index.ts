import Joi from 'joi';

/**
 * validate employee and company request
 */

export const createEmployeeValidationSchema = Joi.object().keys({
    company: Joi.object().keys({
        id: Joi.number().required(),
        name: Joi.string().regex(/^[a-zA-Z, ]*$/).required(),
        location: Joi.string().regex(/^[a-zA-Z, ]*$/).required(),
    }),
    employee: Joi.object().keys({
        id: Joi.number().min(3).required(),
        name: Joi.string().regex(/^[a-zA-Z, ]*$/).required(),
        level: Joi.number().required(),
        companyId: Joi.number().required(),
        designation: Joi.string().regex(/^[a-zA-Z, ]*$/).required(),
        location: Joi.string().regex(/^[a-zA-Z, ]*$/).required(),
    }).required()
})

export const updateEmployeeValidationSchema = Joi.object().keys({
    employee: Joi.object().keys({
        id: Joi.number().min(3).required(),
        name: Joi.string().regex(/^[a-zA-Z, ]*$/).required(),
        level: Joi.number().required(),
        designation: Joi.string().regex(/^[a-zA-Z, ]*$/).required(),
        location: Joi.string().regex(/^[a-zA-Z, ]*$/).required(),
    }).required()
})