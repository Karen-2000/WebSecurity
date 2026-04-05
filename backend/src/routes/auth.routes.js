const express = require('express');
const router = express.Router();
const {
  seedSuperAdmin,
  loginController,
  logoutController
} = require('../controllers/auth.controller');

router.post('/seed-superadmin', seedSuperAdmin);
router.post('/login', loginController);
router.post('/logout', logoutController);

module.exports = router;