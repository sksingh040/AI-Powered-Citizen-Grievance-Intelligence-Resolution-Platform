import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { resolveWithEvidenceApi } from '../../services/api';
import { FileUpload } from '../common/FileUpload';
import { ShieldCheck, CheckSquare, Camera, FileCheck2 } from 'lucide-react';

export const EvidenceClosureModal = ({ isOpen, onClose, complaint, onComplaintResolved }) => {
  const [afterPhotoUrl, setAfterPhotoUrl] = useState(
    'https://images.unsplash.com/photo-1517486808906-6ca8b3f04846?w=800&auto=format&fit=crop&q=60'
  );
  const [workOrderRef, setWorkOrderRef] = useState(`WO-${Date.now().toString().slice(-6)}`);
  const [closureNotes, setClosureNotes] = useState('Remediation completed on site. Asphalt patched and rolled. Area restored.');
  const [siteInspected, setSiteInspected] = useState(true);
  const [hazardNeutralized, setHazardNeutralized] = useState(true);
  const [photoVerified, setPhotoVerified] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  if (!complaint) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!afterPhotoUrl) {
      alert('Mandatory PRD Requirement: An after-remediation photographic proof is required for ticket resolution.');
      return;
    }
    if (!siteInspected || !hazardNeutralized || !photoVerified) {
      alert('Please confirm all three inspection verification checklist items.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await resolveWithEvidenceApi(complaint.ticketId, {
        afterPhotoUrl,
        workOrderRef,
        closureNotes,
        checklist: { siteInspected, hazardNeutralized, photoVerified }
      });

      if (res.data.success) {
        if (onComplaintResolved) onComplaintResolved(res.data.data.complaint);
        onClose();
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error resolving complaint.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Evidence-Based Closure: ${complaint.ticketId}`} maxWidth="640px">
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div style={{ padding: '0.75rem 1rem', background: 'var(--priority-low-bg)', color: 'var(--emerald-700)', borderRadius: 'var(--radius-md)', fontSize: '0.82rem', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
          <ShieldCheck size={16} style={{ display: 'inline', marginRight: '0.35rem', verticalAlign: 'middle' }} />
          Compliance Notice: Evidence-backed resolution triggers an automated 48-hour citizen verification & rating window.
        </div>

        <div>
          <label className="form-label">Municipal Work Order Reference *</label>
          <input
            type="text"
            required
            className="form-control"
            value={workOrderRef}
            onChange={(e) => setWorkOrderRef(e.target.value)}
          />
        </div>

        <div>
          <label className="form-label">After-Remediation Proof Photo URL *</label>
          <input
            type="text"
            required
            className="form-control"
            value={afterPhotoUrl}
            onChange={(e) => setAfterPhotoUrl(e.target.value)}
            placeholder="https://..."
          />
          {afterPhotoUrl && (
            <div style={{ height: '140px', borderRadius: 'var(--radius-md)', overflow: 'hidden', marginTop: '0.5rem', border: '1px solid var(--border-subtle)' }}>
              <img src={afterPhotoUrl} alt="After Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          )}
        </div>

        <div>
          <label className="form-label">Official Remediation Notes *</label>
          <textarea
            rows={3}
            required
            className="form-control"
            value={closureNotes}
            onChange={(e) => setClosureNotes(e.target.value)}
          />
        </div>

        <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.6rem' }}>
            Mandatory Resolution Checklist:
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.8rem' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={siteInspected} onChange={(e) => setSiteInspected(e.target.checked)} />
              <span>Physical on-site inspection completed by municipal team</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={hazardNeutralized} onChange={(e) => setHazardNeutralized(e.target.checked)} />
              <span>Public hazard neutralized to safe municipal operating standards</span>
            </label>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" checked={photoVerified} onChange={(e) => setPhotoVerified(e.target.checked)} />
              <span>Time/Geo-tagged completion photograph authenticated</span>
            </label>
          </div>
        </div>

        <button type="submit" disabled={submitting} className="btn btn-success" style={{ padding: '0.8rem' }}>
          {submitting ? 'Authenticating Evidence...' : 'Submit Evidence & Mark Resolved'}
        </button>

      </form>
    </Modal>
  );
};
