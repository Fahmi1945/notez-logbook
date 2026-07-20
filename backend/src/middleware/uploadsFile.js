const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = '../../notez-logbook/backend/uploads';


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const filename = file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Invalid file type'), false);
  } else {
    cb(null, true)
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter, limits: { fileSize: 1024 * 1024 * 5 } });

module.exports = upload;
