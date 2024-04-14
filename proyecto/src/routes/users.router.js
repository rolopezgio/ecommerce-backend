const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller.js');

router.put('/premium/:uid', UserController.changeUserRole);

router.post('/:uid/documents', UserController.uploadDocuments);

router.get('/', UserController.getAllUsers);

router.delete('/', UserController.deleteInactiveUsers);

module.exports = router;
