require('dotenv').config()
require('colors')


exports.LogPORT = (PORT) => {
    const appNameLOG = `${process.env.APP_NAME} `.white.inverse

    console.log(
         appNameLOG + `SERVER is on PORT: ${PORT}`.green.inverse
    );
}