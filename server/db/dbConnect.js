const mongoose = require('mongoose');
const logMsg = require('../helper/logger')
require('dotenv').config()

let DB_URL = `mongodb+srv://${ process.env.MONGODB_USER }:${ process.env.MONGODB_PASS }@${ process.env.MONGODB_HOST }/${ process.env.MONGODB_DB }?retryWrites=true&w=majority`

const mongooseHelper = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};


mongoose.connect(DB_URL, mongooseHelper)
.then(result => {
    logMsg.LogDB(DB_URL)
    })
.catch(err => {
    logMsg.logERR(err)
    })


exports.mongoose = mongoose;