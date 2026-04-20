const express = require('express');
const router = express.Router();

const { getAuditLogsController } = require('../controllers/audit.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { checkInactivity } = require('../middlewares/activity.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get(
  '/',
  authMiddleware,
  checkInactivity,
  authorizeRoles('SuperAdmin'),
  getAuditLogsController
);

module.exports = router;