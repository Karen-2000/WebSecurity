const express = require('express');
const router = express.Router();
const { seedSuperAdmin } = require('../controllers/auth.controller');

router.post('/seed-superadmin', seedSuperAdmin);

module.exports = router;