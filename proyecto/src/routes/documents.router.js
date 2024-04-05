const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller.js');
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let destinationFolder = 'uploads/';
    
    if (file.fieldname === 'profile') {
      destinationFolder += 'profiles/';
    } else if (file.fieldname === 'product') {
      destinationFolder += 'products/';
    } else if (file.fieldname === 'document') {
      destinationFolder += 'documents/';
    } else {
      destinationFolder += 'others/';
    }
    
    cb(null, destinationFolder); 
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post('/:uid/documents', upload.array('documents'), UserController.uploadDocuments);

module.exports = router;
