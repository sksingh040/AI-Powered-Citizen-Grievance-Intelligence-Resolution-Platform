import mongoose from 'mongoose';

const departmentSchema = new mongoose.Schema(
  {
    deptId: { type: String, required: true, unique: true },
    name: { type: String, required: true },
    code: { type: String, required: true },
    description: { type: String, default: '' },
    defaultSlaHours: { type: Number, default: 48 },
    categories: [String],
    escalationContact: {
      name: { type: String, default: 'Nodal Officer' },
      email: { type: String, default: 'nodal@civic.gov.in' },
      phone: { type: String, default: '1800-11-2026' }
    }
  },
  { timestamps: true }
);

export default mongoose.models.Department || mongoose.model('Department', departmentSchema);
