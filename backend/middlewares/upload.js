const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'tmp/'),
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'text/csv') cb(null, true);
  else cb(new Error('Only CSV files are allowed'), false);
};

module.exports = multer({ storage, fileFilter });
