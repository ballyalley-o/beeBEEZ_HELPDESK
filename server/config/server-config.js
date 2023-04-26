const express = require("express");
const feedRoutes = require('../routes/feed');
const cors = require('cors');
const logMsg = require('../helper/logger')
require('dotenv').config()



class App {
    constructor () {
        this.app = express();
        this.port = process.env.PORT || 8003;
        this.app.use(express.json());
        this.app.use(cors());
        this.regRoutes();
    }

    regRoutes() {
        this.app.use('/feed', feedRoutes);
    }

    start() {
        try {
            this.app.listen(this.port, () => {
                logMsg.LogPORT(this.port)
            });
        }
        catch (err) {
            logMsg.logERR(err)
        }
    }
}


module.exports = App;