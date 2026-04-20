const {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct
} = require('../services/product.service');
const { registerAuditEvent } = require('../utils/audit');

const validateProductPayload = ({
  code,
  name,
  description,
  quantity,
  price,
  category
}, isCreate = true) => {
  if (isCreate && !code) return 'El código es obligatorio';
  if (!name) return 'El nombre es obligatorio';
  if (!description) return 'La descripción es obligatoria';
  if (quantity === undefined || quantity === null) return 'La cantidad es obligatoria';
  if (price === undefined || price === null) return 'El precio es obligatorio';
  if (!category) return 'La categoría es obligatoria';

  if (isCreate && typeof code !== 'string') return 'El código debe ser texto';
  if (typeof name !== 'string') return 'El nombre debe ser texto';
  if (typeof description !== 'string') return 'La descripción debe ser texto';
  if (typeof category !== 'string') return 'La categoría debe ser texto';

  if (Number(quantity) < 0) return 'La cantidad no puede ser negativa';
  if (Number(price) < 0) return 'El precio no puede ser negativo';

  return null;
};

const getProductsController = async (req, res) => {
  try {
    const products = await getAllProducts();
    return res.status(200).json(products);
  } catch (error) {
    console.error('Error listando productos:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const getProductController = async (req, res) => {
  try {
    const product = await getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error obteniendo producto:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const createProductController = async (req, res) => {
  try {
    const validationError = validateProductPayload(req.body, true);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const product = await createProduct({
      ...req.body,
      quantity: Number(req.body.quantity),
      price: Number(req.body.price),
      userId: req.user.id
    });

    await registerAuditEvent({
      userId: req.user.id,
      eventType: 'PRODUCT_CREATED',
      entityType: 'products',
      entityId: String(product.id),
      route: req.originalUrl,
      method: req.method,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      statusCode: 201,
      details: {
        code: product.code,
        name: product.name
      }
    });

    return res.status(201).json(product);
  } catch (error) {
    console.error('Error creando producto:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const updateProductController = async (req, res) => {
  try {
    const validationError = validateProductPayload(req.body, false);

    if (validationError) {
      return res.status(400).json({ message: validationError });
    }

    const existing = await getProductById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const product = await updateProduct(req.params.id, {
      ...req.body,
      quantity: Number(req.body.quantity),
      price: Number(req.body.price),
      userId: req.user.id
    });

    await registerAuditEvent({
      userId: req.user.id,
      eventType: 'PRODUCT_UPDATED',
      entityType: 'products',
      entityId: String(product.id),
      route: req.originalUrl,
      method: req.method,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      statusCode: 200,
      details: {
        name: product.name
      }
    });

    return res.status(200).json(product);
  } catch (error) {
    console.error('Error actualizando producto:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

const deleteProductController = async (req, res) => {
  try {
    const existing = await getProductById(req.params.id);

    if (!existing) {
      return res.status(404).json({ message: 'Producto no encontrado' });
    }

    const product = await softDeleteProduct(req.params.id, req.user.id);

    await registerAuditEvent({
      userId: req.user.id,
      eventType: 'PRODUCT_DELETED',
      entityType: 'products',
      entityId: String(product.id),
      route: req.originalUrl,
      method: req.method,
      ipAddress: req.ip,
      userAgent: req.get('user-agent'),
      statusCode: 200,
      details: {
        name: product.name
      }
    });

    return res.status(200).json({ message: 'Producto eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando producto:', error);
    return res.status(500).json({ message: 'Error interno del servidor' });
  }
};

module.exports = {
  getProductsController,
  getProductController,
  createProductController,
  updateProductController,
  deleteProductController
};
