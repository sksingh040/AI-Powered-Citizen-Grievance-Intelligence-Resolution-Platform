import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { formatDate } from '../../utils/formatters';
import { DEPARTMENTS } from '../../utils/constants';
import { overrideTriageApi, updateStatusApi, assignOfficerApi } from '../../services/api';
import {
  Sparkles,
  Edit3,
  Check,
  ShieldCheck,
  Volume2,
  MapPin,
  Clock,
  User,
  ArrowRight,
  AlertTriangle
} from 'lucide-react';

export const ComplaintDetailModal = ({ isOpen, onClose, complaint, onComplaintUpdated }) => {
  const [isEditingTriage, setIsEditingTriage] = useState(false);
  const [selectedDept, setSelectedDept] = useState(complaint?.departmentId || 'dept_roads');
  const [overridePriority, setOverridePriority] = useState(complaint?.priority?.score || 50);
  const [overrideReason, setOverrideReason] = useState('');
  const [assigneeName, setAssigneeName] = useState(complaint?.assignedOfficer?.name || '');
  const [updating, setUpdating] = useState(false);

  if (!complaint) return null;

  const handleSaveTriageOverride = async (e) => {
    e.preventDefault();
    if (!overrideReason.trim()) {
      alert('Mandatory PRD Requirement: An audit explanation rationale is required to override AI triage.');
      return;
    }

    try {
      setUpdating(true);
      const res = await overrideTriageApi(complaint.ticketId, {\n        departmentId: selectedDept,
        priorityScore: overridePriority,
        overrideReason
      });

      if (res.data.success) {
        setIsEditingTriage(false);
        if (onComplaintUpdated) onComplaintUpdated(res.data.data.complaint);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating triage.');
    } finally {
      setUpdating(false);
    }
  };

  const handleQuickStatusChange = async (newStatus) => {
    try {
      setUpdating(true);
      const res = await updateStatusApi(complaint.ticketId, {
        newStatus,
        comment: `Officer transitioned status to ${newStatus}`
      });
      if (res.data.success) {
        if (onComplaintUpdated) onComplaintUpdated(res.data.data.complaint);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error updating status.');
    } finally {
      setUpdating(false);
    }
  };

  const handleAssignOfficer = async (e) => {
    e.preventDefault();
    try {
      setUpdating(true);
      const res = await assignOfficerApi(complaint.ticketId, { officerName: assigneeName });
      if (res.data.success) {
        if (onComplaintUpdated) onComplaintUpdated(res.data.data.complaint);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error assigning officer.');
    } finally {
      setUpdating(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Inspect Grievance Ticket: ${complaint.ticketId}`} maxWidth="720px">
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <PriorityBadge band={complaint.priority?.band} />
            <StatusBadge status={complaint.status} />
            <span className="badge badge-normal">{complaint.departmentName}</span>
          </div>
          <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Created: {formatDate(complaint.createdAt)}</span>
        </div>

        <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
          <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
            Original Citizen Input ({complaint.language?.toUpperCase()}):
          </div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
            "{complaint.originalText}"
          </div>

          {complaint.translatedText && complaint.language !== 'en' && (
            <div style={{ marginTop: '0.6rem', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.6rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--primary-600)' }}>
                English Working Representation (AI Translated):
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                "{complaint.translatedText}"
              </div>
            </div>
          )}

          {complaint.voiceRecording?.audioUrl && (
            <div style={{ marginTop: '0.6rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Volume2 size={16} color="var(--saffron-500)" />
              <audio controls src={complaint.voiceRecording.audioUrl} style={{ height: '32px' }} />
            </div>
          )}
        </div>

        {complaint.media && complaint.media.length > 0 && (
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
              Attached Photos & Evidence:
            </div>
            <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              {complaint.media.map((m, idx) => (
                <div key={idx} style={{ width: '120px', height: '100px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
                  <img src={m.url} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              ))}
            </div>
          </div>
        )}

        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-lg)',
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(255, 119, 0, 0.08))',
            border: '1px solid rgba(59, 130, 246, 0.3)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.9rem' }}>
              <Sparkles size={18} />
              <span>AI Triage & Rationale Breakdown</span>
            </div>
            {!isEditingTriage ? (
              <button
                type="button"
                onClick={() => setIsEditingTriage(true)}
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem', borderRadius: 'var(--radius-sm)' }}
              >
                <Edit3 size={13} />
                <span>Override Triage</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setIsEditingTriage(false)}
                className="btn btn-secondary"
                style={{ padding: '0.3rem 0.65rem', fontSize: '0.75rem' }}
              >
                Cancel
              </button>
            )}
          </div>

          {!isEditingTriage ? (
            <div className="grid-2" style={{ gap: '1rem', fontSize: '0.82rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Classified Category & Confidence:</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
                  {complaint.aiInference?.predictedCategory?.replace(/_/g, ' ')} (
                  {Math.round((complaint.aiInference?.confidenceScore || 0.9) * 100)}%)
                </div>
                <div style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>Assessed Priority Score:</div>
                <div style={{ fontWeight: 700, color: 'var(--primary-600)' }}>
                  {complaint.priority?.score} / 100 ({complaint.priority?.band})
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)' }}>Explainability Rationale:</div>
                <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)' }}>
                  "{complaint.aiInference?.rationale}"
                </div>
                {complaint.priority?.topFactors && (
                  <ul style={{ paddingLeft: '1rem', marginTop: '0.35rem', color: 'var(--text-muted)', fontSize: '0.75rem' }}>
                    {complaint.priority.topFactors.map((f, fIdx) => (
                      <li key={fIdx}>{f}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ) : (
            <form onSubmit={handleSaveTriageOverride} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div className="grid-2" style={{ gap: '0.75rem' }}>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Reassign Department</label>
                  <select
                    className="form-control"
                    value={selectedDept}
                    onChange={(e) => setSelectedDept(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  >
                    {DEPARTMENTS.map((d) => (
                      <option key={d.id} value={d.id}>{d.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="form-label" style={{ fontSize: '0.75rem' }}>Adjust Priority Score (0-100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    className="form-control"
                    value={overridePriority}
                    onChange={(e) => setOverridePriority(e.target.value)}
                    style={{ fontSize: '0.85rem' }}
                  />
                </div>
              </div>

              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>
                  Mandatory Audit Rationale (Explain why AI recommendation was overridden) *
                </label>
                <input
                  type="text"
                  required
                  className="form-control"
                  placeholder="e.g. Ground inspection confirms water main burst instead of routine drainage blockage."
                  value={overrideReason}
                  onChange={(e) => setOverrideReason(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>

              <button
                type="submit"
                disabled={updating}
                className="btn btn-primary"
                style={{ alignSelf: 'flex-start', padding: '0.5rem 1rem' }}
              >
                {updating ? 'Saving...' : 'Confirm Override & Log Audit'}
              </button>
            </form>
          )}
        </div>

        <form onSubmit={handleAssignOfficer} style={{ display: 'flex', gap: '0.5rem', alignItems: 'flex-end' }}>
          <div style={{ flex: 1 }}>
            <label className="form-label" style={{ fontSize: '0.75rem' }}>Assign Field Officer / Junior Engineer</label>
            <input
              type="text"
              className="form-control"
              value={assigneeName}
              onChange={(e) => setAssigneeName(e.target.value)}
              placeholder="e.g. Rajesh Verma (Field Officer)"
              style={{ fontSize: '0.85rem' }}
            />
          </div>
          <button type="submit" disabled={updating} className="btn btn-secondary" style={{ padding: '0.65rem 1rem' }}>
            Assign
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <button
            type="button"
            disabled={updating || complaint.status === 'in_progress'}
            onClick={() => handleQuickStatusChange('in_progress')}
            className="btn btn-primary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            Mark In Progress
          </button>

          <button
            type="button"
            disabled={updating || complaint.status === 'escalated'}
            onClick={() => handleQuickStatusChange('escalated')}
            className="btn btn-danger"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            Escalate to Commissioner
          </button>

          <button
            type="button"
            disabled={updating || complaint.status === 'rejected'}
            onClick={() => handleQuickStatusChange('rejected')}
            className="btn btn-secondary"
            style={{ fontSize: '0.8rem', padding: '0.45rem 0.85rem' }}
          >
            Reject with Reason
          </button>
        </div>

      </div>
    </Modal>
  );
};
