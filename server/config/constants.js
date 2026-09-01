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

export const SUPPORTED_LANGUAGES = [\n  { code: 'hi', name: 'Hindi', label: 'हिन्दी' },\n  { code: 'en', name: 'English', label: 'English' },\n  { code: 'ta', name: 'Tamil', label: 'தமிழ்' },\n  { code: 'te', name: 'Telugu', label: 'తెలుగు' },\n  { code: 'mr', name: 'Marathi', label: 'मराठी' },\n  { code: 'bn', name: 'Bengali', label: 'বাংলা' }\n];

export const DEPARTMENTS = [\n  {\n    id: 'dept_roads',\n    name: 'Roads & Infrastructure',\n    code: 'ROADS',\n    description: 'Potholes, broken roads, footpaths, bridges, traffic signals',\n    defaultSlaHours: 48,\n    categories: ['pothole', 'broken_road', 'footpath_damage', 'traffic_light_failure', 'bridge_hazard']\n  },\n  {\n    id: 'dept_sanitation',\n    name: 'Solid Waste & Sanitation',\n    code: 'SAN',\n    description: 'Overflowing dustbins, garbage accumulation, public toilet hygiene, sweeping',\n    defaultSlaHours: 24,\n    categories: ['garbage_overflow', 'illegal_dumping', 'dirty_public_toilet', 'dead_animal_removal']\n  },\n  {\n    id: 'dept_water',\n    name: 'Water Supply & Sewage',\n    code: 'WATER',\n    description: 'Water pipeline leakage, contaminated supply, low pressure, blocked sewer lines',\n    defaultSlaHours: 36,\n    categories: ['water_leakage', 'contaminated_water', 'no_water_supply', 'drainage_overflow', 'sewer_blockage']\n  },\n  {\n    id: 'dept_electrical',\n    name: 'Street Lighting & Power',\n    code: 'ELEC',\n    description: 'Dark streetlights, dangling wires, open electrical panels, pole damage',\n    defaultSlaHours: 24,\n    categories: ['streetlight_dark', 'hanging_wire_hazard', 'broken_electric_pole', 'transformer_spark']\n  },\n  {\n    id: 'dept_health',\n    name: 'Public Health & Pest Control',\n    code: 'HEALTH',\n    description: 'Mosquito breeding, stagnant water, stray animal distress, food safety hazards',\n    defaultSlaHours: 48,\n    categories: ['mosquito_fogging', 'stagnant_water_hazard', 'stray_animal_menace', 'food_adulteration']\n  },\n  {\n    id: 'dept_parks',\n    name: 'Parks & Environment',\n    code: 'PARKS',\n    description: 'Fallen trees, dangerous branches, park maintenance, encroachment',\n    defaultSlaHours: 72,\n    categories: ['fallen_tree', 'encroachment', 'park_damage', 'illegal_tree_felling']\n  }\n];

export const PRIORITY_BANDS = {\n  CRITICAL: { label: 'Critical', min: 80, max: 100, color: '#ef4444' },\n  HIGH: { label: 'High', min: 60, max: 79, color: '#f97316' },\n  NORMAL: { label: 'Normal', min: 30, max: 59, color: '#3b82f6' },\n  LOW: { label: 'Low', min: 0, max: 29, color: '#10b981' }\n};

export const SENSITIVE_ZONES = [\n  'Hospital',\n  'School',\n  'Metro Station',\n  'Bus Terminus',\n  'Highway',\n  'Marketplace'\n];
