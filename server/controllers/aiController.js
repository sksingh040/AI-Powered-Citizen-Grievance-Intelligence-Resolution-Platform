import { processCivicAI } from '../services/aiService.js';
import { calculatePriorityScore } from '../utils/priorityCalculator.js';
import { checkSensitiveZoneProximity, getWardAndZone } from '../services/geoService.js';
import { sendSuccess } from '../utils/apiResponse.js';

export const runAiTriagePreview = async (req, res, next) => {
  try {
    const { text, language = 'en', lat = 28.6139, lng = 77.2090, imageUrl = null, audioUrl = null } = req.body;

    const aiResult = await processCivicAI({
      text: text || '',
      language,
      imageUrl,
      audioUrl
    });

    const sensitiveCheck = checkSensitiveZoneProximity(lat, lng);
    const { ward, zone } = getWardAndZone(lat, lng);

    const priorityResult = calculatePriorityScore({
      category: aiResult.aiInference.predictedCategory,
      isSafetyHazard: aiResult.aiInference.isSafetyHazard,
      isSensitiveZone: sensitiveCheck.isSensitive,
      sensitiveZoneType: sensitiveCheck.type,
      sentimentUrgency: aiResult.aiInference.sentimentUrgency
    });

    return sendSuccess(res, 'AI Triage preview generated', {
      aiInference: aiResult.aiInference,
      translatedText: aiResult.translatedText,
      detectedTranscript: aiResult.detectedTranscript,
      estimatedPriority: priorityResult,
      geoEnrichment: {
        ward,
        zone,
        sensitiveZone: sensitiveCheck
      }
    });
  } catch (error) {
    next(error);
  }
};
