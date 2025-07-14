const multer = require('multer');
const path = require('path');

// Konfigurasi penyimpanan file
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // folder tujuan
  },
  filename: function (req, file, cb) {
    // bikin nama unik: timestamp + nama asli
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filter file hanya gambar (jpeg, png, jpg, gif)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const ext = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mime = allowedTypes.test(file.mimetype);

  if (ext && mime) cb(null, true);
  else cb(new Error('Hanya file gambar yang diizinkan'));
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
