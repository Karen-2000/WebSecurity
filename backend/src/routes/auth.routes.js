const express = require('express');
const router = express.Router();
const {
  seedSuperAdmin,
  loginController,
  logoutController,
  sessionController
} = require('../controllers/auth.controller');
const { validateOrigin } = require('../middlewares/origin.middleware');
const { loginRateLimiter } = require('../middlewares/timeLimit.middleware');

router.post('/seed-superadmin', validateOrigin, seedSuperAdmin);
router.get('/session', sessionController);
router.post('/login', loginRateLimiter, loginController);
router.post('/logout', validateOrigin, logoutController);

module.exports = router;
