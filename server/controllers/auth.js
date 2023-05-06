const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken')
const User = require('../models/User');
const { validationResult } = require('express-validator');
require('dotenv').config()


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
    const password = req.body.password;
    bcrypt
    .hash(password, 12)
    .then(hashedPwd => {
        const user = new User({
            email: email,
            password: hashedPwd,
            name: name
        })
        return user.save()
    })
    .then(result => {
        res
            .status(201)
            .json({
                message: 'USER CREATED',
                userId: result._id
            })
    })
    .catch(err => {
        if (!err.statusCode) {
            err.statusCode = 500;
        }
        next(err);
    })
}

exports.login = (req, res, next) => {
    const email = req.body.email;
    const password = req.body.password;
    let loadedUser;
    User.findOne({email: email})
        .then(user => {
            if(!user) {
                const error = new Error('USER NOT FOUND');
                error.statusCode = 401;
                throw error;
            }
            loadedUser = user;
            return bcrypt.compare(password, user.password);
        })
        .then(isEqual => {
            if (!isEqual) {
                const error = new Error('INVALID CREDENTIALS');
                error.statusCode = 401;
                throw error;
            }
            const token = jwt.sign(
              {
                email: loadedUser.email,
                userId: loadedUser._id.toString(),
              },
              process.env.JWT_SECRET,
              {
                expiresIn: "3h",
              }
            );
            res
                .status(200)
                .json({
                    token: token,
                    userId: loadedUser._id.toString()
                })
        })
        .catch(err => {
              if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
        })
}