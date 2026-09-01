import React from 'react';
import { Flame, MapPin, AlertCircle, TrendingUp } from 'lucide-react';

export const HotspotAnalytics = ({ wardHotspots = [], categoryDistribution = [] }) => {
  return (
    <div className="grid-2" style={{ gap: '1.5rem' }}>
      
      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--rose-500)', fontWeight: 700, marginBottom: '1rem' }}>
          <Flame size={18} />
          <span>Emerging Ward Hotspots & Vulnerability Heat</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {wardHotspots.map((w, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary-600)" />
                <span style={{ fontWeight: 600, fontSize: '0.85rem' }}>{w.ward}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-high">{w.count} Active Incidents</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-600)', fontWeight: 700, marginBottom: '1rem' }}>
          <TrendingUp size={18} />
          <span>Grievance Distribution by Civic Category</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
          {categoryDistribution.map((cat, idx) => (
            <div
              key={idx}
              style={{
                padding: '0.85rem 1rem',
                borderRadius: 'var(--radius-md)',
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between'
              }}
            >
              <span style={{ fontWeight: 600, fontSize: '0.85rem', textTransform: 'capitalize' }}>
                {cat.name.replace(/_/g, ' ')}
              </span>
              <span className="badge badge-normal">{cat.count} Reports</span>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
};
