const pool = require('../config/db');

const registerAuditEvent = async ({
  userId = null,
  eventType,
  entityType = null,
  entityId = null,
  route = null,
  method = null,
  ipAddress = null,
  userAgent = null,
  statusCode = null,
  details = {}
}) => {
  await pool.query(
    `
    INSERT INTO public.audit_logs
    (user_id, event_type, entity_type, entity_id, route, method, ip_address, user_agent, status_code, details)
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
    `,
    [
      userId,
      eventType,
      entityType,
      entityId,
      route,
      method,
      ipAddress,
      userAgent,
      statusCode,
      details
    ]
  );
};

module.exports = {
  registerAuditEvent
};