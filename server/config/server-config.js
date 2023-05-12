const path = require("path");
const express = require("express");
const multer = require("multer");
const feedRoutes = require("../routes/feed");
const authRoutes = require("../routes/auth");
const setHeader = require("../middleware/set-header");
const errorHandler = require("../middleware/error-handler");
const cors = require("cors");
const logMsg = require("../helper/logger");
const { fileStorage, fileFilter } = require("../helper/file-upload");
require("dotenv").config();

class App {
  constructor() {
    this.app = express();
    this.port = process.env.PORT || 8003;
    this.app.use(express.json());

    this.app.use(cors({}));
    this.app.use('/images', express.static(path.join(__dirname, '..', 'images')));
    this.app.use(setHeader);
    this.app.use(errorHandler);
    this.app.use(
      multer({
        storage: fileStorage,
        fileFilter: fileFilter,
      }).single("image")
    );
    this.regRoutes();
  }

  regRoutes() {
    this.app.use("/feed", feedRoutes);
    this.app.use("/auth", authRoutes);
  }

  start() {
    try {
      const server = this.app.listen(this.port, () => {
        logMsg.LogPORT(this.port);
      });
      this.socket = require("../helper/socket").init(server);
      this.socket.on('connection', socket => {
        console.log('CLIENT CONNECTED'.bgCyan);
      })
    } catch (err) {
      logMsg.logERR(err);
    }
  }
}

module.exports = App;
