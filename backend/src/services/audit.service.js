const pool = require('../config/db');

const getAuditLogs = async ({
  eventType,
  userId,
  dateFrom,
  dateTo,
  limit = 100
}) => {
  let query = `
    SELECT
      id,
      user_id,
      event_type,
      entity_type,
      entity_id,
      route,
      method,
      ip_address,
      user_agent,
      status_code,
      details,
      created_at
    FROM public.audit_logs
    WHERE 1=1
  `;

  const values = [];
  let index = 1;

  if (eventType) {
    query += ` AND event_type = $${index++}`;
    values.push(eventType);
  }

  if (userId) {
    query += ` AND user_id = $${index++}`;
    values.push(userId);
  }

  if (dateFrom) {
    query += ` AND created_at >= $${index++}`;
    values.push(dateFrom);
  }

  if (dateTo) {
    query += ` AND created_at <= $${index++}`;
    values.push(dateTo);
  }

  query += ` ORDER BY created_at DESC LIMIT $${index}`;
  values.push(limit);

  const result = await pool.query(query, values);
  return result.rows;
};

module.exports = {
  getAuditLogs
};