const multer = require('multer');

const FilesExtensions = ['jpg', 'txt'];

const Storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, `data/${req.user || ''}`);
  },
  filename: (req, file, cb) => {
    cb(null, `${file.originalname}`);
  },
});

const upload = multer({
  fileFilter: (req, file, cb) => {
    const extension = file.originalname.split('.')[1];
    if (!FilesExtensions.includes(extension)) {
      return cb(new Error('file extension is not supported'));
    }
    return cb(null, true);
  },
  storage: Storage,
  limits: { fileSize: 10000000, files: 1 },
}).single('upload');

module.exports = (req, res) => {
  return new Promise((resolve, reject) => {
    upload(req, res, (err) => {
      if (err) {
        return reject(err);
      }
      return resolve();
    })
  }); 
};
