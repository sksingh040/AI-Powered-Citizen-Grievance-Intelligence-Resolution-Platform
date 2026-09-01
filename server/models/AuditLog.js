import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    action: { type: String, required: true },
    actor: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      name: { type: String, default: 'System' },
      role: { type: String, default: 'system' }
    },
    targetType: { type: String, enum: ['Complaint', 'IncidentCluster', 'User', 'Department', 'System'], default: 'Complaint' },
    targetId: { type: String, required: true },
    changes: {
      before: { type: mongoose.Schema.Types.Mixed, default: {} },
      after: { type: mongoose.Schema.Types.Mixed, default: {} }
    },
    reason: { type: String, default: 'Routine operational status transition' },
    aiMetadata: {
      originalModelPrediction: { type: String, default: null },
      confidenceScore: { type: Number, default: null },
      humanOverridden: { type: Boolean, default: false }
    },
    ipAddress: { type: String, default: '127.0.0.1' }
  },
  { timestamps: true }
);

export default mongoose.models.AuditLog || mongoose.model('AuditLog', auditLogSchema);
