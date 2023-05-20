const multer = require("multer");
const path = require('path')
const uuid = require("uuid");

const UUID = uuid.v4()

const MIME_TYPE_MAP = {
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'image/png': 'png',
}

const fileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'images');
    },
    filename: (req, file, cb) => {
        const ext = MIME_TYPE_MAP[file.mimetype];
        cb(null, UUID + "." + ext);
    }
});

const fileFilter = (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid file type')
    cb(error, isValid)
}

const multerCONFIG = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
}).single('image');

module.exports = {
    fileStorage,
    fileFilter,
    multerCONFIG
}