const User = require('../models/User')
const { validationResult } = require('express-validator')


exports.signup = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const error =  new Error('Validation Failed');
        error.statusCode = 422;
        errors.data = errors.array();
        throw error
    }
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password
}