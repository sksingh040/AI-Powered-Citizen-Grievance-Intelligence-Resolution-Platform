import express from 'express';
import { runAiTriagePreview } from '../controllers/aiController.js';

const router = express.Router();

router.post('/triage-preview', runAiTriagePreview);

export default router;
