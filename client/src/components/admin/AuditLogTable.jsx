import React from 'react';
import { formatDate } from '../../utils/formatters';
import { ShieldCheck, UserCheck, Bot, FileText, Lock } from 'lucide-react';

export const AuditLogTable = ({ logs = [] }) => {
  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Lock size={20} color="var(--primary-600)" />
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Immutable Tamper-Evident Audit Trail</h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
              Cryptographically indexed decision logs, supervisor overrides, and evidence closure events.
            </p>
          </div>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', background: 'var(--bg-surface-elevated)' }}>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Log ID</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Timestamp</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Actor & Role</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Action</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Target Entity</th>
              <th style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>Reason / AI Explanation</th>
            </tr>
          </thead>
          <tbody>
            {logs.map((log) => (
              <tr key={log.logId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                <td style={{ padding: '0.75rem 1rem', fontFamily: 'monospace', fontWeight: 700, color: 'var(--primary-600)' }}>
                  {log.logId}
                </td>
                <td style={{ padding: '0.75rem 1rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>
                  {formatDate(log.createdAt)}
                </td>
                <td style={{ padding: '0.75rem 1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                    {log.actor?.role === 'system' ? <Bot size={14} color="var(--primary-600)" /> : <UserCheck size={14} color="var(--emerald-600)" />}
                    <span style={{ fontWeight: 600 }}>{log.actor?.name}</span>
                  </div>
                  <span className="badge badge-normal" style={{ fontSize: '0.65rem', marginTop: '0.15rem' }}>
                    {log.actor?.role}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 700 }}>
                  <span style={{ padding: '0.2rem 0.5rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-surface-elevated)', border: '1px solid var(--border-subtle)' }}>
                    {log.action}
                  </span>
                </td>
                <td style={{ padding: '0.75rem 1rem', fontWeight: 600 }}>
                  {log.ticketId || log.targetId}
                </td>
                <td style={{ padding: '0.75rem 1rem', maxWidth: '320px', color: 'var(--text-secondary)' }}>
                  <div>{log.reason}</div>
                  {log.aiExplanation && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontStyle: 'italic', marginTop: '0.2rem' }}>
                      AI Context: {log.aiExplanation}
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
