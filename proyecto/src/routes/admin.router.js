const express = require('express');
const router = express.Router();
const UserController = require('../controllers/user.controller.js');

router.get('/admin', UserController.showAdminPanel);

module.exports = router;
