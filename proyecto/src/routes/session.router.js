const express = require('express');
const router = express.Router();
const sessionController = require('../controllers/session.controller.js');

router.use(async (req, res, next) => {
    if (req.isAuthenticated()) {
      try {
        const userId = req.user._id;
        await User.findByIdAndUpdate(userId, { last_connection: new Date() });
      } catch (error) {
        console.error('Error al actualizar last_connection:', error);
      }
    }
    next();
  });

router.post('/login', sessionController.loginUser);
router.post('/registro', sessionController.registerUser);
router.get('/logout', sessionController.logoutUser);
router.get('/github', sessionController.authenticateGitHub);
router.get('/callbackGithub', sessionController.githubCallback);
router.get('/errorGithub', sessionController.githubError);
router.get('/current', sessionController.getCurrentUser);

module.exports = router;
