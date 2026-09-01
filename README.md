# 🏛️ AI-Powered Citizen Grievance Intelligence & Resolution Platform

> **Smart India Hackathon (SIH) Solution**  
> A multimodal, multilingual civic intelligence platform enabling citizens to report public grievances via voice, photo, text, and map location with automated AI triage, explainable priority scoring, duplicate incident clustering, and evidence-backed resolution workflows.

---

## 🌟 Key Platform Features

1. **Multimodal & Multilingual Reporting**:
   - Audio voice recording with live waveform and Indic speech-to-text ASR (Hindi, English, Tamil, Telugu, Marathi, Bengali).
   - Photo evidence capture with automated **CivicVision** cue detection (potholes, sewage overflow, dark streetlights, live wire hazards).
   - OpenStreetMap / Leaflet GIS map with click-to-pin and GPS geolocation detection.

2. **Automated AI Triage & Explainable Priority Scoring (0–100)**:
   - Instant categorization and department routing with confidence scores.
   - Multi-factor priority score calculation factoring public safety, population impact, sensitive zone bonus (near hospitals/schools), and SLA proximity.
   - Transparent rationale breakdown with human officer override audit trails.

3. **Duplicate Detection & Spatial Incident Clustering**:
   - Haversine distance and semantic NLP matching to identify duplicate complaints within configurable radii (e.g. 250m).
   - Aggregation of multiple citizen reports into single Master Incident Clusters under an assigned Incident Commander.

4. **Evidence-Based Closure & Citizen Contestation**:
   - Mandatory before/after photo comparison, work order reference, and 3-point inspection verification checklist.
   - 48-hour citizen verification window with 1–5 star rating or dispute reopening flow.

5. **24/7 AI Civic Chatbot**:
   - Floating interactive assistant for filing guidance, ticket tracking, and municipal SLA inquiries.

6. **Executive Analytics & Compliance Audit Trail**:
   - Real-time departmental SLA compliance metrics, ward vulnerability hotspots, and tamper-evident audit logs.

---

## 🚀 Technology Stack (MERN)

- **Frontend**: React 18, Vite, Custom Glassmorphic Civic Design System (CSS3), Leaflet GIS Maps, Lucide Icons, Chart.js.
- **Backend**: Node.js, Express.js (ES Modules), Mongoose / MongoDB (with zero-friction In-Memory Fallback Demo Mode).
- **AI & GIS Engine**: Indic NLP transliteration/translation, Civic Vision cue analysis, Haversine geospatial proximity engine, Multi-factor priority scoring algorithm.

---

## 📁 Clean Modular Project Structure

```
d:/ANTIGRAVITY PROJECT/
├── prd.md                    # Complete SIH Product Requirements Document
├── README.md                 # Setup and architecture documentation
├── .env.example              # Root environment template
├── server/                   # Backend Express & Node API
│   ├── package.json
│   ├── .env.example
│   ├── .env
│   ├── server.js             # Main server entry
│   ├── config/               # DB connector, constants, seed loader
│   ├── models/               # Mongoose schemas (User, Complaint, IncidentCluster, AuditLog, etc.)
│   ├── controllers/          # Business logic handlers
│   ├── routes/               # API endpoint routers
│   ├── middlewares/          # Auth JWT, error handling, Multer uploads, audit recording
│   ├── services/             # AI processing, GIS geo-calculations, notifications
│   ├── utils/                # Priority calculator, duplicate detector, response helpers
│   └── data/                 # Seed demo scenarios (seedData.json)
└── client/                   # Frontend React & Vite PWA
    ├── package.json
    ├── vite.config.js
    ├── index.html
    ├── .env.example
    ├── .env
    └── src/
        ├── index.css         # Glassmorphic accessible civic design system
        ├── main.jsx          # App entry
        ├── App.jsx           # Master navigation & tab routing
        ├── context/          # AuthContext, LanguageContext, ThemeContext
        ├── components/       # Common, Citizen, Officer, Admin, and Map components
        ├── pages/            # Home, File, Track, Officer Queue, Clusters, Analytics, Audit, Auth
        ├── services/         # Axios API clients
        └── utils/            # Translations (6 languages), formatters, constants
```

---

## ⚡ Quick Start Guide

### 1. Backend Setup
```bash
cd server
npm install
npm start
```
*The backend starts at `http://localhost:5000`.*  
*(Note: If local MongoDB is not running, the server automatically starts in Seed Fallback Mode so all features work immediately out of the box).*

### 2. Frontend Setup
```bash
cd client
npm install
npm run dev
```
*The client starts at `http://localhost:5173`.*

---

## 👥 1-Click Demo Accounts (SIH Evaluation)

Use the quick selector in the top-right profile menu or sign in with these credentials:

| Persona | Email | Password | Role & Purpose |
|---|---|---|---|
| **Citizen Reporter** | `citizen@example.com` | `password123` | File voice/photo grievances, track tickets, rate resolutions |
| **Field Officer** | `officer@roads.gov.in` | `password123` | Inspect tasks, update status, upload after-remediation photos |
| **Department Supervisor** | `supervisor@civic.gov.in` | `password123` | Review AI triage, override routing, merge incident clusters |
| **Municipal Commissioner** | `admin@delhi.gov.in` | `password123` | View cross-department SLA analytics and ward hotspots |
| **Independent Auditor** | `auditor@audit.gov.in` | `password123` | Inspect immutable audit logs and AI override explanations |

---

## 🔗 Key API Endpoints

- `POST /api/v1/complaints`: File multimodal grievance with AI triage & priority scoring
- `GET /api/v1/complaints/:ticketId`: Public-safe or officer-detailed ticket status
- `POST /api/v1/complaints/:ticketId/feedback`: Submit CSAT star rating or contest resolution
- `GET /api/v1/complaints/public-hotspots`: Public GIS map pins and cluster coordinates
- `GET /api/v1/officer/queue`: Filterable work queue with SLA countdowns
- `PATCH /api/v1/officer/:ticketId/override-triage`: Supervisor override with recorded audit justification
- `PATCH /api/v1/officer/:ticketId/resolve`: Upload after-remediation evidence & checklist
- `POST /api/v1/incidents/merge`: Merge duplicate tickets into master incident cluster
- `GET /api/v1/analytics/summary`: Executive KPI metrics and department SLA adherence
- `GET /api/v1/analytics/audit-trail`: Tamper-evident immutable audit trail ledger
- `POST /api/v1/chatbot/message`: 24/7 multilingual conversational AI assistant
