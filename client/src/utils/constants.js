export const USER_ROLES = {
  CITIZEN: 'citizen',
  FIELD_OFFICER: 'field_officer',
  SUPERVISOR: 'supervisor',
  ADMIN: 'admin',
  AUDITOR: 'auditor'
};

export const COMPLAINT_STATUS = {
  SUBMITTED: 'submitted',
  AI_TRIAGED: 'ai_triaged',
  ASSIGNED: 'assigned',
  ACKNOWLEDGED: 'acknowledged',
  IN_PROGRESS: 'in_progress',
  PENDING_INFO: 'pending_info',
  RESOLVED: 'resolved',
  CLOSED: 'closed',
  REJECTED: 'rejected',
  REOPENED: 'reopened',
  ESCALATED: 'escalated',
  DUPLICATE_LINKED: 'duplicate_linked'
};

export const SUPPORTED_LANGUAGES = [
  { code: 'hi', name: 'Hindi', label: 'हिन्दी', flag: '🇮🇳' },
  { code: 'en', name: 'English', label: 'English', flag: '🌐' },
  { code: 'ta', name: 'Tamil', label: 'தமிழ்', flag: '🇮🇳' },
  { code: 'te', name: 'Telugu', label: 'తెలుగు', flag: '🇮🇳' },
  { code: 'mr', name: 'Marathi', label: 'मराठी', flag: '🇮🇳' },
  { code: 'bn', name: 'Bengali', label: 'বাংলা', flag: '🇮🇳' }
];

export const DEPARTMENTS = [
  { id: 'dept_roads', name: 'Roads & Infrastructure', code: 'ROADS', icon: 'Construction' },
  { id: 'dept_sanitation', name: 'Solid Waste & Sanitation', code: 'SAN', icon: 'Trash2' },
  { id: 'dept_water', name: 'Water Supply & Sewage', code: 'WATER', icon: 'Droplets' },
  { id: 'dept_electrical', name: 'Street Lighting & Power', code: 'ELEC', icon: 'Zap' },
  { id: 'dept_health', name: 'Public Health & Pest Control', code: 'HEALTH', icon: 'Activity' },
  { id: 'dept_parks', name: 'Parks & Environment', code: 'PARKS', icon: 'Trees' }
];
