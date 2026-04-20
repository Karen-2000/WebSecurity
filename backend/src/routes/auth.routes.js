const express = require('express');
const router = express.Router();
const {
  seedSuperAdmin,
  loginController,
  logoutController
} = require('../controllers/auth.controller');
const { validateOrigin } = require('../middlewares/origin.middleware');
const { loginRateLimiter } = require('../middlewares/timeLimit.middleware');

router.post('/seed-superadmin', validateOrigin, seedSuperAdmin);
router.post('/login', validateOrigin, loginRateLimiter, loginController);
router.post('/logout', validateOrigin, logoutController);

module.exports = router;
