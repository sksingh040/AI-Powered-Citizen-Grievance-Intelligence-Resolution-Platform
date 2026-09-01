import express from 'express';
import { getIncidentClusters, createOrMergeCluster } from '../controllers/incidentController.js';
import { protect, authorize } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', getIncidentClusters);
router.post('/merge', protect, authorize('supervisor', 'admin'), createOrMergeCluster);

export default router;
