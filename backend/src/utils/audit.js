const pool = require('../config/db');

const normalizeIpAddress = (ipAddress) => {
  if (ipAddress === '::1') {
    return '127.0.0.1';
  }

  if (typeof ipAddress === 'string' && ipAddress.startsWith('::ffff:')) {
    return ipAddress.replace('::ffff:', '');
  }

  return ipAddress;
};

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
      normalizeIpAddress(ipAddress),
      userAgent,
      statusCode,
      details
    ]
  );
};

module.exports = {
  registerAuditEvent
};
