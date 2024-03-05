const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller.js');

router.put('/premium/:uid', UserController.changeUserRole);

module.exports = router;
