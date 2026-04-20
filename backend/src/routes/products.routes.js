const express = require('express');
const router = express.Router();

const {
  getProductsController,
  getProductController,
  createProductController,
  updateProductController,
  deleteProductController
} = require('../controllers/products.controller');

const { authMiddleware } = require('../middlewares/auth.middleware');
const { checkInactivity } = require('../middlewares/activity.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get(
  '/',
  authMiddleware,
  checkInactivity,
  authorizeRoles('SuperAdmin', 'Auditor', 'Registrador'),
  getProductsController
);

router.get(
  '/:id',
  authMiddleware,
  checkInactivity,
  authorizeRoles('SuperAdmin', 'Auditor', 'Registrador'),
  getProductController
);

router.post(
  '/',
  authMiddleware,
  checkInactivity,
  authorizeRoles('SuperAdmin', 'Registrador'),
  createProductController
);

router.put(
  '/:id',
  authMiddleware,
  checkInactivity,
  authorizeRoles('SuperAdmin', 'Registrador'),
  updateProductController
);

router.delete(
  '/:id',
  authMiddleware,
  checkInactivity,
  authorizeRoles('SuperAdmin', 'Registrador'),
  deleteProductController
);

module.exports = router;