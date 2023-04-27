const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

const MIME_TYPE_MAP = {
    'image/png': 'png',
    'image/jpg': 'jpg',
    'image/jpeg': 'jpeg',
    'application/pdf': 'pdf'
}


const fileStorage = multer.diskStorage({
    destination:  (req, file, cb) => {
        cb(null, 'images')
    },
    filename: (req, file, cb) => {
        cb(null, uuidv4() + '.' + MIME_TYPE_MAP[file.mimetype])
    }
})

const fileFilter =(req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpg' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'application/pdf') {
        cb(null, true)
    } else {
        cb(null, false)
    }

}


module.exports = fileUpload