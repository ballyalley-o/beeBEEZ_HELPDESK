const { deleteImage } = require('./delete-image');
require('express');


const graphqlFileUploadCONFIG = (req, res, next) => {
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

exports.graphqlFileUploadCONFIG = graphqlFileUploadCONFIG;
