import Complaint from '../models/Complaint.js';
import IncidentCluster from '../models/IncidentCluster.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';
import { processCivicAI } from '../services/aiService.js';
import { calculatePriorityScore } from '../utils/priorityCalculator.js';
import { findPotentialDuplicates } from '../utils/duplicateDetector.js';
import { getWardAndZone, checkSensitiveZoneProximity } from '../services/geoService.js';
import { sendCivicNotification } from '../services/notificationService.js';
import { recordAuditLog } from '../middlewares/auditMiddleware.js';
import { isDbMockMode } from '../config/db.js';
import { getInMemoryStore } from '../config/seed.js';
import { COMPLAINT_STATUS } from '../config/constants.js';

export const createComplaint = async (req, res, next) => {
  try {
    const {
      originalText,
      language = 'en',
      location = { lat: 28.6139, lng: 77.2090, address: '', landmark: '' },
      media = [],
      voiceRecording = null,
      reporter = { name: 'Citizen', phone: '', email: '', isAnonymous: false },
      intakeChannel = 'web'
    } = req.body;

    if (!originalText && !voiceRecording?.audioUrl) {
      return sendError(res, 'Please provide grievance description or voice recording.', 400);
    }

    const randomSuffix = Math.floor(10000 + Math.random() * 90000);
    const ticketId = `GRV-2026-${randomSuffix}`;

    const { ward, zone } = getWardAndZone(location.lat, location.lng);
    const sensitiveCheck = checkSensitiveZoneProximity(location.lat, location.lng);

    const enrichedLocation = {
      lat: location.lat,
      lng: location.lng,
      address: location.address || `${ward}, New Delhi`,
      landmark: location.landmark || (sensitiveCheck.isSensitive ? `Near ${sensitiveCheck.name}` : ''),
      ward,
      zone,
      isSensitiveZone: sensitiveCheck.isSensitive,
      sensitiveZoneType: sensitiveCheck.type
    };

    const firstImageUrl = media.find((m) => m.type === 'image')?.url || null;
    const aiResult = await processCivicAI({
      text: originalText || '',
      language,
      imageUrl: firstImageUrl,
      audioUrl: voiceRecording?.audioUrl
    });

    const priorityResult = calculatePriorityScore({
      category: aiResult.aiInference.predictedCategory,
      isSafetyHazard: aiResult.aiInference.isSafetyHazard,
      isSensitiveZone: enrichedLocation.isSensitiveZone,
      sensitiveZoneType: enrichedLocation.sensitiveZoneType,
      sentimentUrgency: aiResult.aiInference.sentimentUrgency
    });

    let existingComplaints = [];
    if (isDbMockMode()) {
      existingComplaints = getInMemoryStore().complaints;
    } else {
      existingComplaints = await Complaint.find({ status: { $ne: COMPLAINT_STATUS.CLOSED } }).lean();
    }

    const potentialDuplicates = findPotentialDuplicates(
      {
        ticketId,
        location: enrichedLocation,
        aiInference: aiResult.aiInference,
        translatedText: aiResult.translatedText,
        originalText,
        departmentId: aiResult.aiInference.departmentId
      },
      existingComplaints,
      350
    );

    const duplicateInfo = {
      isPotentialDuplicate: potentialDuplicates.length > 0,
      similarityScore: potentialDuplicates[0]?.similarityScore || 0,
      primaryTicketId: potentialDuplicates[0]?.matchedComplaint?.ticketId || null,
      linkedAt: potentialDuplicates.length > 0 ? new Date() : null
    };

    const timeline = [
      {
        status: COMPLAINT_STATUS.SUBMITTED,
        actorName: reporter.isAnonymous ? 'Anonymous Citizen' : (reporter.name || 'Citizen Reporter'),
        actorRole: 'citizen',
        timestamp: new Date(),
        comment: `Grievance registered via ${intakeChannel} intake channel in ${language.toUpperCase()}`,
        publicSafeMessage: 'Complaint registered successfully and assigned ticket ID.'
      },
      {
        status: COMPLAINT_STATUS.AI_TRIAGED,
        actorName: 'AI Triage Engine (Indic Core)',
        actorRole: 'system',
        timestamp: new Date(Date.now() + 1000),
        comment: `AI classified as ${aiResult.aiInference.predictedCategory} (${Math.round(
          aiResult.aiInference.confidenceScore * 100
        )}% confidence). Priority score: ${priorityResult.score} (${priorityResult.band}).`,
        publicSafeMessage: `AI validated category: ${aiResult.aiInference.departmentName}. Priority assessed as ${priorityResult.band}.`
      }
    ];

    const complaintData = {
      ticketId,
      reporter: {
        userId: req.user?._id || null,
        name: reporter.isAnonymous ? 'Anonymous Citizen' : (reporter.name || 'Citizen Reporter'),
        phone: reporter.phone || '',
        email: reporter.email || '',
        isAnonymous: Boolean(reporter.isAnonymous),
        consentGiven: true
      },
      intakeChannel,
      language,
      originalText: originalText || aiResult.detectedTranscript || 'Voice grievance filed.',
      translatedText: aiResult.translatedText,
      voiceRecording: voiceRecording
        ? {
            audioUrl: voiceRecording.audioUrl,
            transcript: aiResult.detectedTranscript || 'Voice recording processed.',
            detectedLanguage: language
          }
        : { audioUrl: null, transcript: null, detectedLanguage: null },
      media: media.map((m) => ({
        url: m.url,
        type: m.type || 'image',
        caption: m.caption || '',
        stage: 'submission',
        aiTags: aiResult.aiInference.visualCues
      })),
      location: enrichedLocation,
      aiInference: aiResult.aiInference,
      priority: {
        score: priorityResult.score,
        band: priorityResult.band,
        breakdown: priorityResult.breakdown,
        topFactors: priorityResult.topFactors
      },
      departmentId: aiResult.aiInference.departmentId,
      departmentName: aiResult.aiInference.departmentName,
      status: COMPLAINT_STATUS.AI_TRIAGED,
      slaHours: aiResult.aiInference.departmentId === 'dept_sanitation' ? 24 : 48,
      slaDeadline: new Date(Date.now() + (aiResult.aiInference.departmentId === 'dept_sanitation' ? 24 : 48) * 3600000),
      duplicateDetection: duplicateInfo,
      timeline,
      createdAt: new Date()
    };

    let savedComplaint;
    if (isDbMockMode()) {
      const store = getInMemoryStore();
      savedComplaint = { ...complaintData, _id: `cmp_${Date.now()}` };
      store.complaints.unshift(savedComplaint);
    } else {
      savedComplaint = await Complaint.create(complaintData);
    }

    await sendCivicNotification({
      ticketId,
      recipientPhone: reporter.phone,
      recipientEmail: reporter.email,
      channel: 'in_app',
      title: `Grievance Ticket Created: ${ticketId}`,
      message: `Your grievance has been received. Ticket ID ${ticketId} routed to ${aiResult.aiInference.departmentName}. Priority: ${priorityResult.band}.`
    });

    await recordAuditLog({
      actor: {
        userId: req.user?._id || 'CITIZEN-ANON',
        name: reporter.isAnonymous ? 'Anonymous Citizen' : (reporter.name || 'Citizen'),
        role: 'citizen'
      },
      action: 'COMPLAINT_CREATED',
      targetType: 'Complaint',
      targetId: savedComplaint._id,
      ticketId,
      changes: { status: COMPLAINT_STATUS.AI_TRIAGED, priority: priorityResult.score },
      reason: `Citizen filed grievance in ${language}. AI completed auto-triage.`,
      aiExplanation: aiResult.aiInference.rationale
    });

    return sendSuccess(
      res,
      `Complaint successfully registered. Your ticket ID is ${ticketId}`,
      {
        ticketId,
        complaint: savedComplaint,
        duplicateWarning: duplicateInfo.isPotentialDuplicate
          ? `Notice: Similar nearby grievance detected (${duplicateInfo.primaryTicketId}).`
          : null
      },
      201
    );
  } catch (error) {
    next(error);
  }
};

export const getComplaintByTicketId = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    let complaint;
    if (isDbMockMode()) {
      complaint = getInMemoryStore().complaints.find(
        (c) => c.ticketId.toUpperCase() === ticketId.trim().toUpperCase()
      );
    } else {
      complaint = await Complaint.findOne({ ticketId: ticketId.trim().toUpperCase() });
    }

    if (!complaint) {
      return sendError(res, `No grievance found with Ticket ID "${ticketId}". Please verify the number.`, 404);
    }

    const isStaff = ['field_officer', 'supervisor', 'admin', 'auditor'].includes(req.user?.role);
    const safeData = isStaff
      ? complaint
      : {
          ticketId: complaint.ticketId,
          intakeChannel: complaint.intakeChannel,
          language: complaint.language,
          originalText: complaint.originalText,
          translatedText: complaint.translatedText,
          media: complaint.media,
          location: {
            address: complaint.location?.address,
            ward: complaint.location?.ward,
            zone: complaint.location?.zone,
            landmark: complaint.location?.landmark,
            lat: complaint.location?.lat,
            lng: complaint.location?.lng
          },
          departmentName: complaint.departmentName,
          status: complaint.status,
          priorityBand: complaint.priority?.band,
          slaDeadline: complaint.slaDeadline,
          resolution: complaint.resolution,
          citizenFeedback: complaint.citizenFeedback,
          timeline: complaint.timeline,
          createdAt: complaint.createdAt
        };

    return sendSuccess(res, 'Grievance ticket details fetched', { complaint: safeData });
  } catch (error) {
    next(error);
  }
};

export const getPublicHotspots = async (req, res, next) => {
  try {
    let complaints = [];
    let clusters = [];

    if (isDbMockMode()) {
      complaints = getInMemoryStore().complaints;
      clusters = getInMemoryStore().incidentClusters;
    } else {
      complaints = await Complaint.find({}).lean();
      clusters = await IncidentCluster.find({}).lean();
    }

    const mapPoints = complaints.map((c) => ({
      ticketId: c.ticketId,
      category: c.aiInference?.predictedCategory || 'General',
      department: c.departmentName,
      status: c.status,
      priorityBand: c.priority?.band || 'Normal',
      lat: c.location?.lat,
      lng: c.location?.lng,
      address: c.location?.address,
      ward: c.location?.ward,
      createdAt: c.createdAt
    }));

    return sendSuccess(res, 'Public grievance hotspots and clusters fetched', {
      points: mapPoints,
      clusters
    });
  } catch (error) {
    next(error);
  }
};

export const submitFeedback = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { rating, comment, isContested, reopenReason } = req.body;

    let complaint;
    let store;
    if (isDbMockMode()) {
      store = getInMemoryStore();
      complaint = store.complaints.find((c) => c.ticketId.toUpperCase() === ticketId.toUpperCase());
    } else {
      complaint = await Complaint.findOne({ ticketId: ticketId.toUpperCase() });
    }

    if (!complaint) {
      return sendError(res, 'Complaint not found', 404);
    }

    const feedbackPayload = {
      rating: Number(rating) || 5,
      comment: comment || '',
      isContested: Boolean(isContested),
      reopenReason: reopenReason || '',
      submittedAt: new Date()
    };

    complaint.citizenFeedback = feedbackPayload;

    if (isContested && reopenReason) {
      complaint.status = COMPLAINT_STATUS.REOPENED;
      complaint.timeline.push({
        status: COMPLAINT_STATUS.REOPENED,
        actorName: 'Citizen Contestation',
        actorRole: 'citizen',
        timestamp: new Date(),
        comment: `Citizen contested resolution: "${reopenReason}". Ticket reopened for supervisory inspection.`,
        publicSafeMessage: 'Resolution contested by citizen. Escalated to supervisor.'
      });
    } else {
      complaint.status = COMPLAINT_STATUS.CLOSED;
      complaint.timeline.push({
        status: COMPLAINT_STATUS.CLOSED,
        actorName: 'Citizen Verification',
        actorRole: 'citizen',
        timestamp: new Date(),
        comment: `Citizen provided ${rating}-star feedback. Ticket marked closed.`,
        publicSafeMessage: 'Citizen satisfied with resolution. Ticket successfully closed.'
      });
    }

    if (!isDbMockMode()) {
      await complaint.save();
    }

    await recordAuditLog({
      actor: { userId: req.user?._id || 'CITIZEN', name: 'Citizen Reporter', role: 'citizen' },
      action: isContested ? 'RESOLUTION_CONTESTED_REOPENED' : 'FEEDBACK_SUBMITTED_CLOSED',\n      targetType: 'Complaint',\n      targetId: complaint._id,\n      ticketId,\n      changes: feedbackPayload,\n      reason: isContested ? `Citizen reopened: ${reopenReason}` : `Rating: ${rating}/5`\n    });\n\n    return sendSuccess(res, 'Feedback submitted successfully', { complaint });\n  } catch (error) {\n    next(error);\n  }\n};\n\nexport const uploadMediaFile = async (req, res, next) => {\n  try {\n    if (!req.file) {\n      return sendError(res, 'No file uploaded', 400);\n    }\n\n    const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;\n    const fileType = req.file.mimetype.startsWith('audio') ? 'audio' : 'image';\n\n    return sendSuccess(res, 'File uploaded successfully', {\n      url: fileUrl,\n      type: fileType,\n      filename: req.file.filename,\n      size: req.file.size\n    });\n  } catch (error) {\n    next(error);\n  }\n};\n