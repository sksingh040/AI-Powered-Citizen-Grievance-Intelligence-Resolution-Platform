import mongoose from 'mongoose';
import { COMPLAINT_STATUS } from '../config/constants.js';

const mediaEvidenceSchema = new mongoose.Schema({
  url: { type: String, required: true },
  type: { type: String, enum: ['image', 'audio', 'video'], default: 'image' },
  uploadedAt: { type: Date, default: Date.now },
  caption: { type: String, default: '' },
  geoTagged: { lat: Number, lng: Number },
  stage: { type: String, enum: ['submission', 'in_progress', 'resolution'], default: 'submission' },
  aiTags: [String]
});

const timelineEventSchema = new mongoose.Schema({
  status: { type: String, required: true },
  actorName: { type: String, default: 'System AI' },
  actorRole: { type: String, default: 'system' },
  timestamp: { type: Date, default: Date.now },
  comment: { type: String, default: '' },
  publicSafeMessage: { type: String, default: '' },
  evidenceUrls: [String]
});

const complaintSchema = new mongoose.Schema(
  {
    ticketId: { type: String, required: true, unique: true, index: true },
    reporter: {
      userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      name: { type: String, default: 'Anonymous Citizen' },
      phone: { type: String, default: '' },
      email: { type: String, default: '' },
      isAnonymous: { type: Boolean, default: false },
      consentGiven: { type: Boolean, default: true }
    },
    intakeChannel: {
      type: String,
      enum: ['web', 'mobile_pwa', 'voice_bot', 'assisted_desk', 'whatsapp_bot'],
      default: 'web'
    },
    language: { type: String, default: 'en' },
    originalText: { type: String, required: true },
    translatedText: { type: String, default: '' },
    voiceRecording: {
      audioUrl: { type: String, default: null },
      transcript: { type: String, default: null },
      detectedLanguage: { type: String, default: null }
    },
    media: [mediaEvidenceSchema],
    location: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
      address: { type: String, default: 'New Delhi, India' },
      landmark: { type: String, default: '' },
      ward: { type: String, default: 'Ward-12' },
      zone: { type: String, default: 'North Central Zone' },
      isSensitiveZone: { type: Boolean, default: false },
      sensitiveZoneType: { type: String, default: null }
    },
    aiInference: {
      predictedDepartment: { type: String, default: 'ROADS' },
      predictedCategory: { type: String, default: 'pothole' },
      confidenceScore: { type: Number, default: 0.92 },
      rationale: { type: String, default: 'Detected road hazard with visual pothole indicators.' },
      visualCues: [String],
      sentimentUrgency: { type: String, enum: ['high', 'moderate', 'low'], default: 'moderate' },
      isSafetyHazard: { type: Boolean, default: false },
      humanVerified: { type: Boolean, default: false },
      verifiedBy: { type: String, default: null }
    },
    priority: {
      score: { type: Number, default: 45, min: 0, max: 100 },
      band: { type: String, enum: ['Critical', 'High', 'Normal', 'Low'], default: 'Normal' },
      breakdown: {
        severity: { type: Number, default: 20 },
        publicSafetyRisk: { type: Number, default: 15 },
        populationImpact: { type: Number, default: 10 },
        sensitiveZoneBonus: { type: Number, default: 0 },
        recurrenceCount: { type: Number, default: 0 },
        slaProximityWeight: { type: Number, default: 0 }
      },
      overrideReason: { type: String, default: null },
      overriddenBy: { type: String, default: null }
    },
    departmentId: { type: String, default: 'dept_roads' },
    departmentName: { type: String, default: 'Roads & Infrastructure' },
    assignedOfficer: {
      officerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
      name: { type: String, default: 'Unassigned' },
      assignedAt: { type: Date, default: null }
    },
    status: {
      type: String,
      enum: Object.values(COMPLAINT_STATUS),
      default: COMPLAINT_STATUS.SUBMITTED
    },
    slaHours: { type: Number, default: 48 },
    slaDeadline: { type: Date },
    isSlaBreached: { type: Boolean, default: false },
    duplicateDetection: {
      isPotentialDuplicate: { type: Boolean, default: false },
      similarityScore: { type: Number, default: 0 },
      primaryTicketId: { type: String, default: null },
      linkedAt: { type: Date, default: null }
    },
    incidentClusterId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'IncidentCluster',
      default: null
    },
    resolution: {
      resolvedAt: { type: Date, default: null },
      resolvedBy: { type: String, default: null },
      closureNotes: { type: String, default: '' },
      workOrderRef: { type: String, default: '' },
      beforePhotoUrl: { type: String, default: null },
      afterPhotoUrl: { type: String, default: null },
      verificationChecklist: {
        siteInspected: { type: Boolean, default: false },
        hazardNeutralized: { type: Boolean, default: false },
        photoVerified: { type: Boolean, default: false }
      }
    },
    citizenFeedback: {
      rating: { type: Number, min: 1, max: 5, default: null },
      comment: { type: String, default: '' },
      isContested: { type: Boolean, default: false },
      reopenReason: { type: String, default: null },
      submittedAt: { type: Date, default: null }
    },
    timeline: [timelineEventSchema]
  },
  { timestamps: true }
);

complaintSchema.pre('save', function (next) {
  if (!this.slaDeadline && this.slaHours) {
    this.slaDeadline = new Date(Date.now() + this.slaHours * 60 * 60 * 1000);
  }
  next();
});

export default mongoose.models.Complaint || mongoose.model('Complaint', complaintSchema);
