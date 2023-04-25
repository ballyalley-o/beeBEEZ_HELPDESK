const express = require('express');
const feedRoutes = require('./routes/feed');
const logMsg = require('./helper/logger')
const cors = require('cors');
require('colors')
require('dotenv').config()

const app = express();

const PORT = 8000;

app.use(express.json());
app.use(cors())
app.use('/feed', feedRoutes);

app.listen(PORT, () => {
    logMsg.LogPORT(PORT)
});