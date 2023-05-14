const fs = require('fs');
require('express');

exports.graphqlFileUploadCONFIG = (req, res, next) => {
  if (!req.isAuth) {
    throw new Error('NOT AUTHENTICATED')
  }
  if (!req.file) {
    return res.status(200).json({ message: 'FILE NOT PROVIDED' });
  }
  if (req.body.oldPath) {
    deleteImage(req.body.oldPath);
  }
  return res
            .status(201)
            .json({
                message: 'FILE SAVED',
                filePath: req.file.path
            });
};

const deleteImage = (filePath) => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, (err) => {
    console.log(err);
  });
};
