import { generateChatbotResponse } from '../services/aiService.js';
import { sendSuccess, sendError } from '../utils/apiResponse.js';

export const handleChat = async (req, res, next) => {
  try {
    const { message, language = 'en', context = {} } = req.body;

    if (!message || message.trim() === '') {
      return sendError(res, 'Please provide a message prompt.', 400);
    }

    const botReply = await generateChatbotResponse(message, language, context);

    return sendSuccess(res, 'AI Civic Assistant response', {
      reply: botReply.text,
      suggestions: botReply.suggestions,
      language
    });
  } catch (error) {
    next(error);
  }
};
