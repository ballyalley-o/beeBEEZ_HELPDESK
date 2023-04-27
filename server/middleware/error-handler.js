const logMsg = require('../helper/logger');

module.exports = (error, req, res, next) => {
    logMsg.logERR(error);
    const status = error.statusCode || 500;
    const message = error.message;
    res
        .status(status)
        .json({message: message || logMsg.logERR("Something went wrong")});
};