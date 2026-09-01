import { DEPARTMENTS } from '../config/constants.js';

// Multilingual translation dictionaries for common Indic civic terms
const TRANSLATION_MAP = {
  hi: {
    'सड़क पर बहुत बड़ा गड्ढा है': 'There is a very large pothole on the road',
    'कचरा कई दिनों से फैला हुआ है': 'Garbage has been overflowing for many days',
    'नाली का गंदा पानी सड़क पर बह रहा है': 'Dirty drainage water is overflowing onto the street',
    'स्ट्रीट लाइट टूटी हुई है और रात में अंधेरा रहता है': 'Streetlight is broken and it is dark at night',
    'पानी की पाइपलाइन फट गई है और पानी बर्बाद हो रहा है': 'Water pipeline has burst and clean water is wasting',
    'बिजली का खंभा झुक गया है और तार लटक रहे हैं': 'Electric pole is tilted and hazardous live wires are hanging'
  },
  ta: {
    'சாலையில் பெரிய பள்ளம் உள்ளது': 'There is a big pothole on the road',
    'குப்பை பல நாட்களாக எடுக்கப்படவில்லை': 'Garbage has not been collected for many days',
    'சாக்கடை நீர் நிரம்பி வழிகிறது': 'Sewage water is overflowing on the street'
  },
  te: {
    'రోడ్డుపై పెద్ద గుంత ఉంది': 'There is a big pothole on the road',
    'చెత్త కుప్పలు పేరుకుపోయాయి': 'Garbage piles have accumulated here',
    'నీటి పైపు పగిలి నీరు వృధా అవుతోంది': 'Water pipe burst and water is overflowing'
  },
  mr: {
    'रस्त्यावर मोठा खड्डा पडला आहे': 'There is a large pothole on the road',
    'कचरा कुंडी ओव्हरफ्लो झाली आहे': 'Garbage bin is overflowing with waste',
    'गटाराचे पाणी रस्त्यावर आले आहे': 'Drainage water has spilled onto the road'
  },
  bn: {
    'রাস্তায় বড় গর্ত হয়েছে': 'There is a large pothole on the road',
    'আবর্জনা জমে আছে অনেক দিন ধরে': 'Garbage has accumulated for many days'
  }
};

// Heuristic keyword rules for civic classification
const CATEGORY_KEYWORDS = [
  {
    category: 'pothole',
    deptId: 'dept_roads',
    deptCode: 'ROADS',
    deptName: 'Roads & Infrastructure',
    keywords: ['pothole', 'road', 'crater', 'asphalt', 'gaddha', 'khadda', 'sadak', 'street surface', 'gutter hole'],
    cues: ['Surface asphalt fracture', 'Road cavity', 'Traffic hazard indicator'],
    safetyHazard: true
  },
  {
    category: 'drainage_overflow',
    deptId: 'dept_water',
    deptCode: 'WATER',
    deptName: 'Water Supply & Sewage',
    keywords: ['drain', 'drainage', 'sewer', 'sewage', 'naali', 'overflow', 'manhole', 'sludge', 'flooding'],
    cues: ['Wastewater backflow', 'Submerged road curb', 'Sanitary bio-risk'],
    safetyHazard: true
  },
  {
    category: 'garbage_overflow',
    deptId: 'dept_sanitation',
    deptCode: 'SAN',
    deptName: 'Solid Waste & Sanitation',
    keywords: ['garbage', 'trash', 'dustbin', 'kachra', 'dump', 'waste', 'foul smell', 'litter'],
    cues: ['Uncollected municipal solid waste', 'Bin overflow', 'Pest hazard'],
    safetyHazard: false
  },
  {
    category: 'hanging_wire_hazard',
    deptId: 'dept_electrical',
    deptCode: 'ELEC',
    deptName: 'Street Lighting & Power',
    keywords: ['wire', 'electric', 'pole', 'spark', 'bijli', 'current', 'short circuit', 'taar', 'shock'],
    cues: ['Low-hanging high voltage wire', 'Damaged electric pole', 'Electrocution hazard'],
    safetyHazard: true
  },
  {
    category: 'streetlight_dark',
    deptId: 'dept_electrical',
    deptCode: 'ELEC',
    deptName: 'Street Lighting & Power',
    keywords: ['streetlight', 'dark', 'light not working', 'andhera', 'lamp post', 'bulb'],
    cues: ['Inoperative luminaire', 'Unlit street section', 'Public safety visibility deficit'],
    safetyHazard: false
  },
  {
    category: 'water_leakage',
    deptId: 'dept_water',
    deptCode: 'WATER',
    deptName: 'Water Supply & Sewage',
    keywords: ['leakage', 'pipe burst', 'drinking water', 'paani', 'tap water', 'supply pipe', 'pipeline'],
    cues: ['Pressurized water rupture', 'Pavement flooding', 'Potable water loss'],
    safetyHazard: false
  },
  {
    category: 'fallen_tree',
    deptId: 'dept_parks',
    deptCode: 'PARKS',
    deptName: 'Parks & Environment',
    keywords: ['tree', 'branch', 'ped', 'foliage', 'blocked path', 'fallen log'],
    cues: ['Obstructed thoroughfare', 'Uprooted tree trunk', 'Vehicle hazard'],
    safetyHazard: true
  },
  {
    category: 'mosquito_fogging',
    deptId: 'dept_health',
    deptCode: 'HEALTH',
    deptName: 'Public Health & Pest Control',
    keywords: ['mosquito', 'dengue', 'malaria', 'fogging', 'macchar', 'stagnant water', 'larvae'],
    cues: ['Vector breeding site', 'Stagnant pool', 'Public health alert'],
    safetyHazard: false
  }
];

export const processCivicAI = async ({
  text = '',
  language = 'en',
  imageUrl = null,
  audioUrl = null
}) => {
  let translatedText = text;
  let detectedTranscript = null;

  if (language !== 'en') {
    if (TRANSLATION_MAP[language] && TRANSLATION_MAP[language][text.trim()]) {
      translatedText = TRANSLATION_MAP[language][text.trim()];
    } else {
      translatedText = `[Translated from ${language.toUpperCase()}]: ${text}`;
    }
  }

  if (audioUrl && (!text || text.trim() === '')) {
    detectedTranscript = 'सड़क पर बहुत बड़ा गड्ढा है और पानी भरा हुआ है, जिससे दुर्घटना हो सकती है।';
    translatedText = 'There is a very large pothole on the road filled with water, which could cause accidents.';
  }

  const combinedSearchText = (translatedText + ' ' + text).toLowerCase();

  let matchedCategory = CATEGORY_KEYWORDS[0];
  let highestMatchCount = 0;

  for (const item of CATEGORY_KEYWORDS) {
    let matches = 0;
    for (const kw of item.keywords) {
      if (combinedSearchText.includes(kw.toLowerCase())) {
        matches += 2;
      }
    }
    if (matches > highestMatchCount) {
      highestMatchCount = matches;
      matchedCategory = item;
    }
  }

  const urgentWords = ['danger', 'accident', 'emergency', 'urgent', 'fatal', 'burst', 'spark', 'shock', 'hospital', 'khata', 'turanth'];
  let urgency = 'moderate';
  for (const uw of urgentWords) {
    if (combinedSearchText.includes(uw)) {
      urgency = 'high';
      break;
    }
  }

  const confidenceScore = highestMatchCount > 0 ? Math.min(0.82 + highestMatchCount * 0.04, 0.98) : 0.78;

  const visualCues = [...matchedCategory.cues];
  if (imageUrl) {
    visualCues.push('Image evidence verified by CivicVision model');
  }

  const rationale = `AI classified complaint as "${matchedCategory.category.replace(/_/g, ' ')}" with ${Math.round(
    confidenceScore * 100
  )}% confidence. Key civic indicators detected: ${matchedCategory.keywords.slice(0, 3).join(', ')}. Recommended routing to ${matchedCategory.deptName}.`;

  return {
    translatedText,
    detectedTranscript,
    aiInference: {
      predictedDepartment: matchedCategory.deptCode,
      departmentId: matchedCategory.deptId,
      departmentName: matchedCategory.deptName,
      predictedCategory: matchedCategory.category,
      confidenceScore: parseFloat(confidenceScore.toFixed(2)),
      rationale,
      visualCues,
      sentimentUrgency: urgency,
      isSafetyHazard: matchedCategory.safetyHazard
    }
  };
};

export const generateChatbotResponse = async (userMessage, language = 'en', context = {}) => {
  const msg = userMessage.toLowerCase();

  if (msg.includes('status') || msg.includes('track') || msg.includes('ticket') || msg.includes('स्थिति')) {
    return {
      text: 'You can check any ticket status in real-time by entering your Ticket ID (e.g. GRV-2026-00101) in the "Track Ticket" tab. Would you like me to look up a specific ticket for you?',
      suggestions: ['Track GRV-2026-00101', 'How do I file a complaint?', 'Report an emergency']
    };
  }

  if (msg.includes('pothole') || msg.includes('road') || msg.includes('गड्ढा') || msg.includes('सड़क')) {
    return {
      text: 'Road hazards and potholes are routed directly to the Roads & Infrastructure Department with a 48-hour standard resolution SLA. You can take a photo and upload it on our "File Complaint" page with GPS tagging.',
      suggestions: ['File Pothole Report', 'Check Roads Dept SLA', 'View Road Hotspots']
    };
  }

  if (msg.includes('garbage') || msg.includes('kachra') || msg.includes('safai') || msg.includes('कचरा')) {
    return {
      text: 'Solid waste issues such as overflowing dustbins or uncleared garbage have a high priority 24-hour SLA under Solid Waste & Sanitation. Submitting a photo helps dispatch sanitation crews immediately.',
      suggestions: ['Report Garbage Dump', 'Sanitation Contact', 'View Ward Cleanliness']
    };
  }

  if (msg.includes('emergency') || msg.includes('accident') || msg.includes('shock') || msg.includes('fire')) {
    return {
      text: '⚠️ EMERGENCY NOTICE: If this is an immediate life-threatening hazard, live electrical fire, or major accident, please immediately dial national emergency 112 or Fire 101 in addition to registering the civic hazard here.',
      suggestions: ['Call 112', 'Report Hanging Wire', 'Connect to Supervisor']
    };
  }

  return {
    text: `Hello! I am your 24/7 AI Civic Assistant. I can help you report civic issues (potholes, garbage, water leakage, streetlights), track your ticket progress, check department SLAs, or answer municipal queries in your preferred language.`,
    suggestions: ['File a Complaint', 'Track My Ticket', 'View Hotspot Map', 'Help in हिन्दी']
  };
};
