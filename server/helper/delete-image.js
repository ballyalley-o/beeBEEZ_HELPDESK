const fs = require('fs');
const path = require('path');
const logMsg = require('./logger');


const deleteImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => {
    logMsg.logERR(err);
  });
};


exports.deleteImage = deleteImage;