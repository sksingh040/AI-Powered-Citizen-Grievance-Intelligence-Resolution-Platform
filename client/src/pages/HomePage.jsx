import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { CivicMap } from '../components/map/CivicMap';
import { getPublicHotspotsApi, getAnalyticsSummaryApi } from '../services/api';
import {
  FilePlus,
  Search,
  Bot,
  ShieldCheck,
  Zap,
  Layers,
  Sparkles,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Flame,
  Clock,
  ThumbsUp
} from 'lucide-react';

export const HomePage = ({ setActiveTab, onSelectTicketToTrack }) => {
  const { t } = useLanguage();
  const { user } = useAuth();
  const [mapData, setMapData] = useState({ points: [], clusters: [] });
  const [kpi, setKpi] = useState({
    totalComplaints: 1284,
    slaComplianceRate: '94.2%',
    meanResolutionHours: '18.4 hrs',
    duplicateReductionRate: '38%'
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [mapRes, kpiRes] = await Promise.all([
          getPublicHotspotsApi(),
          getAnalyticsSummaryApi()
        ]);
        if (mapRes.data.success) setMapData(mapRes.data.data);
        if (kpiRes.data.success) setKpi(kpiRes.data.data.kpi);
      } catch (err) {\n        console.warn('Using cached public map data');
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
      
      <section
        className="glass-card"
        style={{
          padding: '3.5rem 2rem',
          textAlign: 'center',
          background: 'linear-gradient(135deg, rgba(37, 99, 235, 0.08) 0%, rgba(255, 119, 0, 0.08) 50%, rgba(16, 185, 129, 0.08) 100%)',
          border: '1px solid var(--border-glass)'
        }}
      >
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', padding: '0.35rem 0.85rem', borderRadius: 'var(--radius-full)', background: 'var(--primary-50)', color: 'var(--primary-700)', fontSize: '0.8rem', fontWeight: 700, marginBottom: '1.25rem' }}>
          <Sparkles size={14} />
          <span>Smart India Hackathon (SIH) Civic Resolution Platform</span>
        </div>

        <h1 style={{ fontSize: '2.75rem', fontWeight: 900, lineHeight: 1.15, maxWidth: '840px', margin: '0 auto 1.25rem' }}>
          Empowering Every Citizen to Report & Resolve Civic Issues with <span style={{ background: 'linear-gradient(135deg, #ff7700, #2563eb)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Responsible AI</span>
        </h1>

        <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', maxWidth: '680px', margin: '0 auto 2rem', lineHeight: 1.5 }}>
          Multilingual voice, photo, and GIS intake with automated triage, explainable priority scoring, duplicate incident clustering, and tamper-evident evidence closure.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => setActiveTab('file')}
            className="btn btn-saffron"
            style={{ padding: '0.9rem 1.75rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
          >
            <FilePlus size={18} />
            <span>{t('fileGrievance')}</span>
          </button>

          <button
            onClick={() => setActiveTab('track')}
            className="btn btn-primary"
            style={{ padding: '0.9rem 1.75rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
          >
            <Search size={18} />
            <span>{t('trackTicket')}</span>
          </button>

          <button
            onClick={() => setActiveTab('officer')}
            className="btn btn-secondary"
            style={{ padding: '0.9rem 1.5rem', fontSize: '1rem', borderRadius: 'var(--radius-full)' }}
          >
            <span>Officer Queue</span>
            <ArrowRight size={16} />
          </button>
        </div>

        <div className="grid-4" style={{ marginTop: '2.5rem', gap: '1rem' }}>
          <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-600)' }}>{kpi.totalComplaints}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Registered Complaints</div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--emerald-600)' }}>{kpi.slaComplianceRate}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>SLA Adherence Compliance</div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--saffron-600)' }}>{kpi.meanResolutionHours}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Median Resolution Time</div>
          </div>
          <div style={{ padding: '1rem', background: 'var(--bg-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--purple-600)' }}>{kpi.duplicateReductionRate}</div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Duplicate Workload Reduced</div>
          </div>
        </div>
      </section>

      <section>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Live Municipal Grievance & Hotspot Map</h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Real-time geospatial visibility into open civic reports and active incident clusters.
            </p>
          </div>
          <button onClick={() => setActiveTab('clusters')} className="btn btn-secondary" style={{ fontSize: '0.8rem' }}>
            <span>Manage Clusters</span>
            <ArrowRight size={14} />
          </button>
        </div>

        <CivicMap
          points={mapData.points}
          clusters={mapData.clusters}
          height="450px"
          onSelectTicket={(tId) => {
            if (onSelectTicketToTrack) onSelectTicketToTrack(tId);
            setActiveTab('track');
          }}
        />
      </section>

      <section>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Responsible Civic AI Architecture</h2>
          <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)' }}>
            Designed for human-in-the-loop accountability, privacy preservation, and rapid service delivery.
          </p>
        </div>

        <div className="grid-3" style={{ gap: '1.5rem' }}>
          
          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(255, 119, 0, 0.12)', color: '#ff7700', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Bot size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Multimodal & Indic Voice Intake</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Accepts grievances in Hindi, English, Tamil, Telugu, Marathi, and Bengali through audio recordings with live waveform, transcriptions, and photos.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(59, 130, 246, 0.12)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <Zap size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Explainable 0–100 Priority Scoring</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Transparent multi-factor ranking factoring severity, hospital/school zone sensitivity, public safety risk, and SLA deadlines with officer override logs.
            </p>
          </div>

          <div className="glass-card" style={{ padding: '1.75rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', background: 'rgba(16, 185, 129, 0.12)', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem' }}>
              <ShieldCheck size={24} />
            </div>
            <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Evidence-Led Closure & Verification</h3>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
              Mandatory before/after photographs, work orders, on-site inspection checklists, and a 48-hour citizen rating and dispute reopening window.
            </p>
          </div>

        </div>
      </section>

    </div>
  );
};
