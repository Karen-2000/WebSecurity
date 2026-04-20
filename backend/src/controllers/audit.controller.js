const { getAuditLogs } = require('../services/audit.service');

const DEFAULT_LIMIT = 100;
const MAX_LIMIT = 500;

const buildDate = (value) => {
  if (!value) {
    return null;
  }

  const parsedDate = new Date(value);
  return Number.isNaN(parsedDate.getTime()) ? null : parsedDate;
};

const validateAuditFilters = ({
  user_id,
  date_from,
  date_to,
  limit
}) => {
  const normalizedLimit = limit === undefined ? DEFAULT_LIMIT : Number(limit);

  if (!Number.isInteger(normalizedLimit) || normalizedLimit <= 0 || normalizedLimit > MAX_LIMIT) {
    return {
      error: `limit debe ser un entero entre 1 y ${MAX_LIMIT}`
    };
  }

  if (user_id !== undefined && (!Number.isInteger(Number(user_id)) || Number(user_id) <= 0)) {
    return {
      error: 'user_id debe ser un entero positivo'
    };
  }

  const dateFrom = buildDate(date_from);
  const dateTo = buildDate(date_to);

  if (date_from && !dateFrom) {
    return {
      error: 'date_from no es una fecha válida'
    };
  }

  if (date_to && !dateTo) {
    return {
      error: 'date_to no es una fecha válida'
    };
  }

  if (dateFrom && dateTo && dateFrom > dateTo) {
    return {
      error: 'date_from no puede ser mayor que date_to'
    };
  }

  return {
    filters: {
      userId: user_id === undefined ? undefined : Number(user_id),
      dateFrom: date_from,
      dateTo: date_to,
      limit: normalizedLimit
    }
  };
};

const getAuditLogsController = async (req, res) => {
  try {
    const {
      event_type,
      user_id,
      date_from,
      date_to,
      limit
    } = req.query;

    const { error, filters } = validateAuditFilters({
      user_id,
      date_from,
      date_to,
      limit
    });

    if (error) {
      return res.status(400).json({
        message: error
      });
    }

    const logs = await getAuditLogs({
      eventType: event_type,
      userId: filters.userId,
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      limit: filters.limit
    });

    return res.status(200).json(logs);
  } catch (error) {
    console.error('Error obteniendo audit logs:', error);
    return res.status(500).json({
      message: 'Error interno del servidor'
    });
  }
};

module.exports = {
  getAuditLogsController
};
