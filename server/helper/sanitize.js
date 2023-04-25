const { body } = require('express-validator')

const sanitizePost = [
    body('title')
        .trim()
        .isLength({ min: 5 }),
    body('content')
        .trim()
        .isLength({ min: 10 })
]

module.exports = {
    sanitizePost
}