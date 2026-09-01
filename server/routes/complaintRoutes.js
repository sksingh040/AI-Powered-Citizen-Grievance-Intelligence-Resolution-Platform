import express from 'express';
import {
  createComplaint,
  getComplaintByTicketId,
  getPublicHotspots,
  submitFeedback,
  uploadMediaFile
} from '../controllers/complaintController.js';
import { upload } from '../middlewares/uploadMiddleware.js';

const router = express.Router();

router.post('/', createComplaint);
router.post('/upload', upload.single('file'), uploadMediaFile);
router.get('/public-hotspots', getPublicHotspots);
router.get('/:ticketId', getComplaintByTicketId);
router.post('/:ticketId/feedback', submitFeedback);

export default router;
