const pool = require('../config/db');

const getAllProducts = async () => {
  const result = await pool.query(
    `
    SELECT id, code, name, description, quantity, price, category, is_active, created_at, updated_at
    FROM public.products
    WHERE is_active = true
    ORDER BY id DESC
    `
  );

  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query(
    `
    SELECT id, code, name, description, quantity, price, category, is_active, created_at, updated_at
    FROM public.products
    WHERE id = $1
    LIMIT 1
    `,
    [id]
  );

  return result.rows[0];
};

const createProduct = async ({
  code,
  name,
  description,
  quantity,
  price,
  category,
  userId
}) => {
  const result = await pool.query(
    `
    INSERT INTO public.products
    (code, name, description, quantity, price, category, created_by, updated_by)
    VALUES ($1, $2, $3, $4, $5, $6, $7, $7)
    RETURNING *
    `,
    [code, name, description, quantity, price, category, userId]
  );

  return result.rows[0];
};

const updateProduct = async (
  id,
  {
    name,
    description,
    quantity,
    price,
    category,
    userId
  }
) => {
  const result = await pool.query(
    `
    UPDATE public.products
    SET
      name = $1,
      description = $2,
      quantity = $3,
      price = $4,
      category = $5,
      updated_by = $6
    WHERE id = $7
    RETURNING *
    `,
    [name, description, quantity, price, category, userId, id]
  );

  return result.rows[0];
};

const softDeleteProduct = async (id, userId) => {
  const result = await pool.query(
    `
    UPDATE public.products
    SET
      is_active = false,
      updated_by = $1
    WHERE id = $2
    RETURNING *
    `,
    [userId, id]
  );

  return result.rows[0];
};

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  softDeleteProduct
};