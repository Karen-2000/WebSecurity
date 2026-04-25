const express = require('express');
const router = express.Router();

const {
  getProductsController,
  getProductController,
  createProductController,
  updateProductController,
  deleteProductController
} = require('../controllers/products.controller');

const { validateOrigin } = require('../middlewares/origin.middleware');
const { authMiddleware } = require('../middlewares/auth.middleware');
const { checkInactivity } = require('../middlewares/activity.middleware');
const { authorizeRoles } = require('../middlewares/role.middleware');

router.get(
  '/',
  authMiddleware,
  checkInactivity,
  authorizeRoles('Auditor', 'Registrador'),
  getProductsController
);

router.get(
  '/:id',
  authMiddleware,
  checkInactivity,
  authorizeRoles('Auditor', 'Registrador'),
  getProductController
);

router.post(
  '/',
  validateOrigin,
  authMiddleware,
  checkInactivity,
  authorizeRoles('Registrador'),
  createProductController
);

router.put(
  '/:id',
  validateOrigin,
  authMiddleware,
  checkInactivity,
  authorizeRoles('Registrador'),
  updateProductController
);

router.delete(
  '/:id',
  validateOrigin,
  authMiddleware,
  checkInactivity,
  authorizeRoles('Registrador'),
  deleteProductController
);

module.exports = router;
