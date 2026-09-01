import mongoose from 'mongoose';

const feedbackSchema = new mongoose.Schema(
  {
    complaintId: { type: mongoose.Schema.Types.ObjectId, ref: 'Complaint', required: true },
    ticketId: { type: String, required: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    rating: { type: Number, min: 1, max: 5, required: true },
    comment: { type: String, default: '' },
    isContested: { type: Boolean, default: false },
    reopenReason: { type: String, default: null },
    counterEvidenceUrls: [String],
    resolutionSatisfied: { type: Boolean, default: true }
  },
  { timestamps: true }
);

export default mongoose.models.Feedback || mongoose.model('Feedback', feedbackSchema);
