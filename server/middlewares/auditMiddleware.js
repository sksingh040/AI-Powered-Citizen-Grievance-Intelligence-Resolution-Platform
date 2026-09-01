import AuditLog from '../models/AuditLog.js';
import { getInMemoryStore } from '../config/seed.js';
import { isDbMockMode } from '../config/db.js';

export const recordAuditLog = async ({
  action,
  actor,
  targetType = 'Complaint',
  targetId,
  changes = {},
  reason = '',
  aiMetadata = {},
  ipAddress = '127.0.0.1'
}) => {
  try {
    const logData = {
      action,
      actor: {
        userId: actor?.userId || null,
        name: actor?.name || 'System Auto',
        role: actor?.role || 'system'
      },
      targetType,
      targetId: String(targetId),
      changes,
      reason,
      aiMetadata,
      ipAddress
    };

    if (isDbMockMode()) {
      const store = getInMemoryStore();
      store.auditLogs.unshift({
        ...logData,
        _id: `aud_${Date.now()}`,
        createdAt: new Date()
      });
    } else {
      await AuditLog.create(logData);
    }
  } catch (error) {
    console.warn(`Audit Log warning: ${error.message}`);
  }
};
