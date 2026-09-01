import React, { useState, useEffect } from 'react';
import { getAuditTrailApi } from '../services/api';
import { AuditLogTable } from '../components/admin/AuditLogTable';
import { FileText, ShieldAlert, Lock, RefreshCw } from 'lucide-react';

export const AuditorLogsPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const res = await getAuditTrailApi();
      if (res.data.success) {
        setLogs(res.data.data.logs);
      }
    } catch (err) {
      console.warn('Audit logs fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)', marginBottom: '0.35rem' }}>
              <ShieldAlert size={22} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Independent Grievance Audit & Compliance Trail
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Full transparency ledger capturing actor decisions, AI triage justifications, supervisor overrides, and evidence closure records.
            </p>
          </div>

          <button
            onClick={fetchLogs}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.55rem 1rem' }}
          >
            <RefreshCw size={15} className={loading ? 'pulse-recording' : ''} />
            <span>Refresh Logs</span>
          </button>
        </div>
      </div>

      <AuditLogTable logs={logs} />

    </div>
  );
};
