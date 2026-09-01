import React from 'react';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { formatDate, formatTimeRemaining } from '../../utils/formatters';
import { Sparkles, Eye, CheckCircle2, Clock, AlertTriangle, UserCheck, ArrowRight } from 'lucide-react';

export const OfficerQueueTable = ({
  queue = [],
  onViewDetail,
  onResolveEvidence,
  onOverrideTriage,
  onUpdateStatus
}) => {
  return (
    <div style={{ overflowX: 'auto', borderRadius: 'var(--radius-lg)', border: '1px solid var(--border-subtle)' }}>
      <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.85rem' }}>
        <thead>
          <tr style={{ background: 'var(--bg-surface-elevated)', borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Ticket ID</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Priority & AI Score</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Category & Location</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Status</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>SLA Countdown</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700 }}>Assignee</th>
            <th style={{ padding: '0.85rem 1rem', fontWeight: 700, textAlign: 'right' }}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {queue.length === 0 ? (
            <tr>
              <td colSpan={7} style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
                No active grievance tickets in this queue.
              </td>
            </tr>
          ) : (
            queue.map((c) => {
              const isOverdue = c.isSlaBreached;
              return (
                <tr
                  key={c.ticketId}
                  style={{
                    borderBottom: '1px solid var(--border-subtle)',
                    background: isOverdue ? 'rgba(239, 68, 68, 0.04)' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary-600)' }}>{c.ticketId}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{formatDate(c.createdAt)}</div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.2rem' }}>
                      <PriorityBadge band={c.priority?.band} />
                      <span style={{ fontSize: '0.75rem', fontWeight: 700 }}>{c.priority?.score}/100</span>
                    </div>
                    {c.aiInference?.isSafetyHazard && (
                      <div style={{ fontSize: '0.7rem', color: 'var(--rose-600)', fontWeight: 600 }}>
                        🚨 Safety Hazard
                      </div>
                    )}
                  </td>

                  <td style={{ padding: '0.85rem 1rem', maxWidth: '240px' }}>
                    <div style={{ fontWeight: 600, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                      {c.aiInference?.predictedCategory?.replace(/_/g, ' ') || 'Civic Issue'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      📍 {c.location?.address || c.location?.ward}
                    </div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <StatusBadge status={c.status} />
                  </td>

                  <td style={{ padding: '0.85rem 1rem' }}>
                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.3rem',
                        fontSize: '0.78rem',
                        fontWeight: 600,
                        color: isOverdue ? 'var(--rose-600)' : 'var(--text-secondary)'
                      }}
                    >
                      <Clock size={14} color={isOverdue ? 'var(--rose-600)' : 'var(--text-muted)'} />
                      <span>{formatTimeRemaining(c.slaDeadline)}</span>
                    </div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', fontSize: '0.8rem' }}>
                    <div style={{ fontWeight: 500 }}>{c.assignedOfficer?.name || 'Unassigned'}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{c.departmentName}</div>
                  </td>

                  <td style={{ padding: '0.85rem 1rem', textAlign: 'right' }}>
                    <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'flex-end' }}>
                      
                      <button
                        type="button"
                        onClick={() => onViewDetail(c)}
                        className="btn btn-secondary"
                        style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                        title="View Details & AI Triage"
                      >
                        <Eye size={14} />
                        <span>Inspect</span>
                      </button>

                      {(c.status === 'in_progress' || c.status === 'assigned') && (
                        <button
                          type="button"
                          onClick={() => onResolveEvidence(c)}
                          className="btn btn-success"
                          style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
                          title="Upload Remediation Proof"
                        >
                          <CheckCircle2 size={14} />
                          <span>Close with Proof</span>
                        </button>
                      )}

                    </div>
                  </td>
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
};
