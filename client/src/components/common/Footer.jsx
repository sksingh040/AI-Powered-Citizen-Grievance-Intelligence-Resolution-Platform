import React from 'react';
import { ShieldCheck, Cpu, MapPin, Heart } from 'lucide-react';

export const Footer = () => {
  return (
    <footer
      style={{
        borderTop: '1px solid var(--border-subtle)',
        background: 'var(--bg-glass)',
        padding: '2rem 0',
        marginTop: 'auto',
        fontSize: '0.82rem',
        color: 'var(--text-secondary)'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck size={18} color="var(--emerald-500)" />
          <span>
            <strong>AI Citizen Grievance Intelligence Platform</strong> — Smart India Hackathon Edition
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Cpu size={15} color="var(--primary-500)" />
            <span>Indic NLP + Civic Vision + GIS Hotspot Engine</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <MapPin size={15} color="var(--saffron-500)" />
            <span>Delhi Municipal Jurisdiction (Ward 1-28)</span>
          </div>
          <div>
            Built with <Heart size={14} color="var(--rose-500)" style={{ display: 'inline', verticalAlign: 'middle' }} /> for accessible civic governance
          </div>
        </div>
      </div>
    </footer>
  );
};
