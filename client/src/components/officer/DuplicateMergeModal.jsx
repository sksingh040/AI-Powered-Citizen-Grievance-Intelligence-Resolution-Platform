import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { mergeIncidentClusterApi } from '../../services/api';
import { Layers, GitMerge, AlertTriangle } from 'lucide-react';

export const DuplicateMergeModal = ({ isOpen, onClose, queue = [], onClusterCreated }) => {
  const [primaryTicketId, setPrimaryTicketId] = useState(queue[0]?.ticketId || 'GRV-2026-00102');
  const [duplicateTicketIds, setDuplicateTicketIds] = useState(['GRV-2026-00103']);
  const [clusterTitle, setClusterTitle] = useState('Major Drainage Failure Cluster - Karol Bagh');
  const [commanderName, setCommanderName] = useState('Sunita Rao (Supervisor)');
  const [rationale, setRationale] = useState('Multiple complaints along Arya Samaj Road indicate main sewer line blockage.');
  const [submitting, setSubmitting] = useState(false);

  const handleToggleDuplicate = (tId) => {
    if (duplicateTicketIds.includes(tId)) {
      setDuplicateTicketIds(duplicateTicketIds.filter((id) => id !== tId));
    } else {
      setDuplicateTicketIds([...duplicateTicketIds, tId]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!primaryTicketId || duplicateTicketIds.length === 0) {
      alert('Please select a primary ticket and at least one duplicate ticket to merge.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await mergeIncidentClusterApi({
        title: clusterTitle,
        primaryTicketId,
        duplicateTicketIds,
        commanderName,
        rationale
      });

      if (res.data.success) {
        if (onClusterCreated) onClusterCreated(res.data.data.cluster);
        onClose();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error creating incident cluster.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Group Duplicates & Create Incident Cluster" maxWidth="640px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div style={{ padding: '0.75rem 1rem', background: 'var(--priority-high-bg)', color: 'var(--priority-high)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', border: '1px solid rgba(249, 115, 22, 0.3)' }}>
          <GitMerge size={16} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
          Cluster Notice: Individual reporter tickets remain active with notifications, but operational teams work against a single unified master incident.
        </div>

        <div>
          <label className="form-label">Incident Cluster Title *</label>
          <input
            type="text"
            required
            className="form-control"
            value={clusterTitle}
            onChange={(e) => setClusterTitle(e.target.value)}\n          />
        </div>

        <div className="grid-2" style={{ gap: '0.75rem' }}>
          <div>
            <label className="form-label">Master Primary Ticket</label>
            <select
              className="form-control"
              value={primaryTicketId}
              onChange={(e) => setPrimaryTicketId(e.target.value)}
            >\n              {queue.map((c) => (
                <option key={c.ticketId} value={c.ticketId}>
                  {c.ticketId} - {c.aiInference?.predictedCategory} ({c.location?.ward})
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="form-label">Incident Commander</label>
            <input
              type="text"
              className="form-control"
              value={commanderName}
              onChange={(e) => setCommanderName(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="form-label">Select Correlated Nearby Tickets to Merge</label>
          <div
            style={{
              maxHeight: '140px',
              overflowY: 'auto',
              border: '1px solid var(--border-subtle)',
              borderRadius: 'var(--radius-md)',
              padding: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.35rem'
            }}
          >
            {queue
              .filter((c) => c.ticketId !== primaryTicketId)
              .map((c) => (
                <label
                  key={c.ticketId}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '0.4rem 0.6rem',
                    background: duplicateTicketIds.includes(c.ticketId) ? 'var(--primary-50)' : 'transparent',
                    borderRadius: 'var(--radius-sm)',
                    fontSize: '0.8rem',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <input
                      type="checkbox"
                      checked={duplicateTicketIds.includes(c.ticketId)}
                      onChange={() => handleToggleDuplicate(c.ticketId)}
                    />
                    <span style={{ fontWeight: 600 }}>{c.ticketId}</span>
                    <span style={{ color: 'var(--text-muted)' }}>{c.originalText.slice(0, 40)}...</span>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>📍 {c.location?.ward}</span>
                </label>
              ))}
          </div>
        </div>

        <div>
          <label className="form-label">Clustering Rationale (Recorded in Audit Trail) *</label>
          <textarea
            rows={2}
            required
            className="form-control"
            value={rationale}
            onChange={(e) => setRationale(e.target.value)}
          />
        </div>

        <button type="submit" disabled={submitting} className="btn btn-saffron" style={{ padding: '0.8rem' }}>
          {submitting ? 'Creating Master Incident Cluster...' : 'Confirm Merge into Incident Cluster'}
        </button>

      </form>
    </Modal>
  );
};
