const Joi = require('joi');

const userSchema = Joi.object({
    username: Joi.string().trim().min(3).max(20).required(),
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
        .required(),
    password: Joi.string()
        .pattern(new RegExp(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,30}$/))
        .required(),
    repeatPassword: Joi.ref('password'),
});

const verifyRegister = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
        .required(),
    otp: Joi.string().trim().length(6).required(),
});

const verifyResendOtp = Joi.object({
    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com'] } })
        .required(),
});

module.exports = { userSchema, verifyRegister, verifyResendOtp };
