import mongoose from 'mongoose';

const incidentClusterSchema = new mongoose.Schema(
  {
    clusterCode: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    department: { type: String, required: true },
    category: { type: String, required: true },
    centroid: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      ward: { type: String, default: 'Ward-12' },
      zone: { type: String, default: 'North Central Zone' }
    },
    radiusMeters: { type: Number, default: 250 },
    complaintIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Complaint' }],
    complaintTickets: [String],
    incidentCommander: {
      officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      name: { type: String, default: 'Senior Supervisor' }
    },
    severityBand: {
      type: String,
      enum: ['Critical', 'High', 'Normal', 'Low'],
      default: 'High'
    },
    status: {
      type: String,
      enum: ['active', 'investigating', 'remediation_in_progress', 'resolved', 'closed'],
      default: 'active'
    },
    summaryRationale: { type: String, default: 'Aggregated geospatial cluster of recurring complaints.' },
    rootCauseCategory: { type: String, default: 'Infrastructure Drainage Defect' },
    isEscalated: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.models.IncidentCluster || mongoose.model('IncidentCluster', incidentClusterSchema);
