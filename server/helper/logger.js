require('dotenv').config()
require('colors')


exports.LogPORT = (PORT) => {
    const appNameLOG = `${process.env.APP_NAME} `.white.inverse

    console.log(
         appNameLOG + `SERVER is on PORT: ${PORT}`.green.inverse
    );
}

exports.LogDB = (DB_URL) => {
    const appNameLOG = `${process.env.APP_NAME} `.white.inverse

    console.log(
         appNameLOG + `DATABASE is connected to ${process.env.MONGODB_HOST}`.yellow.inverse
    );
}

exports.logERR = (err) => {
    console.log(err)
}

exports.logPOST = (result) => {
    console.log(result);
}

exports.logSUCCESS = (msg) => {
    "SUCCESS: ".green.inverse + msg
}