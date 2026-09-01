import express from 'express';
import {
  getOfficerQueue,
  updateComplaintStatus,
  overrideAiTriage,
  resolveWithEvidence,
  assignOfficer
} from '../controllers/officerController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.use(protect);
router.use(authorize('field_officer', 'supervisor', 'admin', 'auditor'));

router.get('/queue', getOfficerQueue);
router.patch('/:ticketId/status', updateComplaintStatus);
router.patch('/:ticketId/override-triage', overrideAiTriage);
router.patch('/:ticketId/resolve', resolveWithEvidence);
router.patch('/:ticketId/assign', assignOfficer);

export default router;
