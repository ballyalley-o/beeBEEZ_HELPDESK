const { body } = require('express-validator');
const User = require('../models/User');

const sanitizePost = [
    body('title')
        .trim()
        .isLength({ min: 6 }),
    body('content')
        .trim()
        .isLength({ min: 10 })
]


const sanitizeAuth = [
  body("email")
    .isEmail()
    .withMessage("Please enter a VALID EMAIL")
    .custom((value, { req }) => {
        return User
                .findOne({email: value})
                .then(userDoc => {
                    if (userDoc) {
                        return Promise.reject('EMAIL ADDRESS ALREADY EXISTS')
                    }
                })

    })
    .normalizeEmail(),
    body('password')
    .trim()
    .isLength({min: 5}),
    body('name')
    .trim()
    .not()
    .isEmpty()
];
module.exports = {
    sanitizePost,
    sanitizeAuth
}