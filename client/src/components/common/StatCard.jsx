import React from 'react';

export const StatCard = ({ title, value, change, icon: Icon, color = 'blue', subtitle }) => {
  const colorMap = {
    blue: { bg: 'rgba(59, 130, 246, 0.12)', text: '#3b82f6' },
    saffron: { bg: 'rgba(255, 119, 0, 0.12)', text: '#ff7700' },
    emerald: { bg: 'rgba(16, 185, 129, 0.12)', text: '#10b981' },
    rose: { bg: 'rgba(239, 68, 68, 0.12)', text: '#ef4444' },
    purple: { bg: 'rgba(139, 92, 246, 0.12)', text: '#8b5cf6' }
  };

  const current = colorMap[color] || colorMap.blue;

  return (
    <div className="glass-card" style={{ padding: '1.25rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
        <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>{title}</span>
        {Icon && (
          <div
            style={{
              width: '36px',
              height: '36px',
              borderRadius: 'var(--radius-md)',
              background: current.bg,
              color: current.text,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <Icon size={20} />
          </div>
        )}
      </div>
      <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', lineHeight: 1.1 }}>{value}</div>
      {(subtitle || change) && (
        <div style={{ marginTop: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          {change && <span style={{ color: current.text, fontWeight: 600, marginRight: '0.35rem' }}>{change}</span>}
          {subtitle}
        </div>
      )}
    </div>
  );
};
