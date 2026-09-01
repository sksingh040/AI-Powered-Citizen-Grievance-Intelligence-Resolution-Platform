import express from 'express';
import { getAnalyticsSummary, getAuditTrail } from '../controllers/analyticsController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/summary', getAnalyticsSummary);
router.get('/audit-trail', protect, authorize('admin', 'auditor'), getAuditTrail);

export default router;
