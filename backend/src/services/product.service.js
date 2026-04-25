const pool = require('../config/db');

const getAllProducts = async ({ includeInactive = false } = {}) => {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.code,
      p.name,
      p.description,
      p.quantity,
      p.price,
      p.category,
      p.is_active,
      p.created_at,
      p.updated_at,
      p.updated_by,
      editor.username AS updated_by_username
    FROM public.products p
    LEFT JOIN public.users editor ON editor.id = p.updated_by
    WHERE ($1::boolean = true OR p.is_active = true)
    ORDER BY p.id DESC
    `,
    [includeInactive]
  );

  return result.rows;
};

const getProductById = async (id) => {
  const result = await pool.query(
    `
    SELECT
      p.id,
      p.code,
      p.name,
      p.description,
      p.quantity,
      p.price,
      p.category,
      p.is_active,
      p.created_at,
      p.updated_at,
      p.updated_by,
      editor.username AS updated_by_username
    FROM public.products p
    LEFT JOIN public.users editor ON editor.id = p.updated_by
    WHERE p.id = $1
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
