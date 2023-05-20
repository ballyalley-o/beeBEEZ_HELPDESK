const path = require("path");
const express = require("express");
const cors = require('cors');
const { multerCONFIG } = require("../helper/file-upload")
// const feedRoutes = require("../routes/feed");
// const authRoutes = require("../routes/auth");
const setHeader = require("../middleware/set-header");
const errorHandler = require("../middleware/error-handler");
const graphqlHttpCONFIG = require('./graphql-config');
const graphqlFileUpload = require('../helper/graphql-upload')
const auth = require('../middleware/auth')
const logMsg = require("../helper/logger");
require("dotenv").config();

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8003;
    this.app.use(express.json());
    this.app.use(cors());
    this.app.use(multerCONFIG);
    this.app.use('/images', express.static(path.join(__dirname, '..', 'images')));
    this.app.use(setHeader);
    this.app.use(errorHandler);
    this.app.use(auth);

    this.app.put('/post-image', graphqlFileUpload.graphqlFileUploadCONFIG);
    this.app.use('/graphql', graphqlHttpCONFIG);


    this.regRoutes();
  }

  regRoutes() {
    // this.app.use("/feed", feedRoutes);
    // this.app.use("/auth", authRoutes);
  }

  start() {
    try {
      this.app.listen(this.port, () => {
        logMsg.LogPORT(this.port);
      });
    } catch (err) {
      logMsg.logERR(err);
    }
  }
}

module.exports = App;
