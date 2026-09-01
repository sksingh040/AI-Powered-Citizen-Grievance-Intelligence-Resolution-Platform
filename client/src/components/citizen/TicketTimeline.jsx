import React from 'react';
import { formatDate } from '../../utils/formatters';
import { CheckCircle2, Clock, Bot, User, AlertCircle, Wrench, ShieldAlert } from 'lucide-react';

export const TicketTimeline = ({ timeline = [] }) => {
  const getEventIcon = (status, role) => {
    if (role === 'system') return <Bot size={16} color="var(--primary-600)" />;
    if (status === 'resolved') return <CheckCircle2 size={16} color="var(--emerald-600)" />;
    if (status === 'in_progress') return <Wrench size={16} color="var(--amber-500)" />;
    if (status === 'reopened' || status === 'escalated') return <ShieldAlert size={16} color="var(--rose-600)" />;
    return <User size={16} color="var(--text-secondary)" />;
  };

  return (
    <div style={{ position: 'relative', paddingLeft: '1.5rem', marginTop: '1.25rem' }}>
      
      <div
        style={{
          position: 'absolute',
          left: '7px',
          top: '10px',
          bottom: '10px',
          width: '2px',
          background: 'var(--border-subtle)'
        }}
      />

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        {timeline.map((event, idx) => (
          <div key={idx} style={{ position: 'relative', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
            
            <div
              style={{
                position: 'absolute',
                left: '-1.5rem',
                top: '2px',
                width: '18px',
                height: '18px',
                borderRadius: '50%',
                background: 'var(--bg-surface)',
                border: '2px solid var(--primary-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1
              }}
            />

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                {getEventIcon(event.status, event.actorRole)}
                <span style={{ fontWeight: 700, fontSize: '0.88rem', textTransform: 'capitalize' }}>
                  {event.status.replace(/_/g, ' ')}
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>by {event.actorName}</span>
              </div>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{formatDate(event.timestamp)}</span>
            </div>

            <div
              style={{
                fontSize: '0.82rem',
                color: 'var(--text-secondary)',
                background: 'var(--bg-surface-elevated)',
                padding: '0.6rem 0.85rem',
                borderRadius: 'var(--radius-sm)',
                border: '1px solid var(--border-subtle)',
                marginTop: '0.25rem'
              }}
            >
              {event.publicSafeMessage || event.comment}
            </div>

            {event.evidenceUrls && event.evidenceUrls.length > 0 && (
              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.4rem' }}>
                {event.evidenceUrls.map((url, uIdx) => (
                  <img
                    key={uIdx}
                    src={url}
                    alt="Resolution Evidence"
                    style={{ width: '80px', height: '80px', borderRadius: 'var(--radius-sm)', objectFit: 'cover', border: '1px solid var(--border-subtle)' }}
                  />
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};
