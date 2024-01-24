const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller.js');

router.post('/login', sessionController.loginUser);
router.post('/registro', sessionController.registerUser);
router.get('/logout', sessionController.logoutUser);
router.get('/github', sessionController.authenticateGitHub);
router.get('/callbackGithub', sessionController.githubCallback);
router.get('/errorGithub', sessionController.githubError);
router.get('/current', sessionController.getCurrentUser);

module.exports = router;
