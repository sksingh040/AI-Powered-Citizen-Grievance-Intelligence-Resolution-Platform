import React, { useState, useEffect } from 'react';
import { getComplaintByTicketIdApi } from '../services/api';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { TicketTimeline } from '../components/citizen/TicketTimeline';
import { EvidenceViewer } from '../components/citizen/EvidenceViewer';
import { FeedbackModal } from '../components/citizen/FeedbackModal';
import { formatDate, formatTimeRemaining } from '../utils/formatters';
import { useLanguage } from '../context/LanguageContext';
import {
  Search,
  CheckCircle2,
  Clock,
  MapPin,
  FileText,
  Star,
  RotateCcw,
  ShieldCheck,
  AlertTriangle
} from 'lucide-react';

export const TrackTicketPage = ({ initialTicketId }) => {
  const { t } = useLanguage();
  const [ticketInput, setTicketInput] = useState(initialTicketId || 'GRV-2026-00104');
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);

  const handleSearch = async (idToSearch) => {
    const searchId = idToSearch || ticketInput;
    if (!searchId || !searchId.trim()) return;

    try {
      setLoading(true);
      setErrorMsg('');
      const res = await getComplaintByTicketIdApi(searchId.trim().toUpperCase());
      if (res.data.success) {
        setComplaint(res.data.data.complaint);
      }
    } catch (err) {
      setComplaint(null);
      setErrorMsg(err.response?.data?.message || 'Ticket not found. Please verify your Ticket ID.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialTicketId) {
      setTicketInput(initialTicketId);
      handleSearch(initialTicketId);
    } else {
      handleSearch('GRV-2026-00104');
    }
  }, [initialTicketId]);

  return (
    <div style={{ maxWidth: '880px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>{t('trackTicket')}</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
          {t('enterTicketToTrack')}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSearch();
          }}
          style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}
        >
          <input
            type="text"
            className="form-control"
            placeholder="GRV-2026-00104"
            value={ticketInput}
            onChange={(e) => setTicketInput(e.target.value)}
            style={{ flex: 1, minWidth: '220px', fontSize: '1rem', fontWeight: 600 }}
          />
          <button type="submit" disabled={loading} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem' }}>
            <Search size={18} />
            <span>{loading ? 'Searching...' : t('search')}</span>
          </button>
        </form>

        <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', alignItems: 'center', flexWrap: 'wrap', fontSize: '0.75rem' }}>
          <span style={{ color: 'var(--text-muted)' }}>Try demo tickets:</span>
          {['GRV-2026-00101', 'GRV-2026-00102', 'GRV-2026-00104', 'GRV-2026-00105'].map((demoId) => (
            <button
              key={demoId}
              type="button"
              onClick={() => {
                setTicketInput(demoId);
                handleSearch(demoId);
              }}
              style={{
                background: 'var(--bg-surface-elevated)',
                border: '1px solid var(--border-subtle)',
                borderRadius: 'var(--radius-sm)',
                padding: '0.25rem 0.5rem',
                cursor: 'pointer',
                fontWeight: 600,
                color: 'var(--primary-600)'
              }}
            >
              {demoId}
            </button>
          ))}
        </div>

        {errorMsg && (
          <div style={{ marginTop: '1rem', padding: '0.75rem 1rem', borderRadius: 'var(--radius-md)', background: 'var(--priority-critical-bg)', color: 'var(--priority-critical)', fontSize: '0.85rem' }}>
            {errorMsg}
          </div>
        )}
      </div>

      {complaint && (
        <div className="glass-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid var(--border-subtle)', paddingBottom: '1.25rem' }}>
            <div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                Grievance Ticket
              </div>
              <h3 style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--primary-600)' }}>
                {complaint.ticketId}
              </h3>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginTop: '0.35rem' }}>
                <PriorityBadge band={complaint.priority?.band || complaint.priorityBand} />
                <StatusBadge status={complaint.status} />
              </div>
            </div>

            <div style={{ textAlign: 'right' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Department Assigned</div>
              <div style={{ fontSize: '1rem', fontWeight: 700 }}>{complaint.departmentName}</div>
              {complaint.slaDeadline && (
                <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.3rem', justifyContent: 'flex-end' }}>
                  <Clock size={14} />
                  <span>{formatTimeRemaining(complaint.slaDeadline)}</span>
                </div>
              )}
            </div>
          </div>

          <div style={{ padding: '1.25rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.35rem' }}>
              Citizen Narrative ({complaint.language?.toUpperCase() || 'EN'}):
            </div>
            <div style={{ fontSize: '0.95rem', color: 'var(--text-primary)', lineHeight: 1.4 }}>
              \"{complaint.originalText}\"
            </div>
            {complaint.location?.address && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.75rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                <MapPin size={14} color=\"var(--primary-600)\" />
                <span>📍 {complaint.location.address} • {complaint.location.ward}</span>
              </div>
            )}
          </div>

          <EvidenceViewer resolution={complaint.resolution} submissionMedia={complaint.media} />

          {complaint.status === 'resolved' && (
            <div
              style={{
                padding: '1.25rem',
                borderRadius: 'var(--radius-lg)',
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(59, 130, 246, 0.12))',
                border: '1px solid var(--emerald-500)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
                gap: '1rem'
              }}
            >
              <div>
                <div style={{ fontWeight: 800, fontSize: '0.95rem', color: 'var(--emerald-700)' }}>
                  ✅ Resolution Verification Window Active
                </div>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Please inspect the photographic remediation evidence above and rate your satisfaction or contest if incomplete.
                </div>
              </div>

              <button
                type="button"
                onClick={() => setShowFeedbackModal(true)}
                className="btn btn-success"
                style={{ padding: '0.65rem 1.25rem' }}
              >
                <Star size={16} />
                <span>Verify & Rate Outcome</span>
              </button>
            </div>
          )}

          {complaint.citizenFeedback?.rating && (
            <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--emerald-600)', marginBottom: '0.25rem' }}>
                Citizen Rating & Verification Submitted:
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
                <span style={{ fontWeight: 800, fontSize: '1rem' }}>{complaint.citizenFeedback.rating} / 5 Stars</span>
              </div>
              {complaint.citizenFeedback.comment && (
                <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                  \"{complaint.citizenFeedback.comment}\"
                </div>
              )}
            </div>
          )}

          <div>
            <h4 style={{ fontSize: '1.05rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              Public-Safe Status Timeline
            </h4>
            <TicketTimeline timeline={complaint.timeline} />
          </div>

        </div>
      )}

      {complaint && (
        <FeedbackModal
          isOpen={showFeedbackModal}
          onClose={() => setShowFeedbackModal(false)}
          ticketId={complaint.ticketId}
          onFeedbackSubmitted={(updatedComplaint) => setComplaint(updatedComplaint)}
        />
      )}

    </div>
  );
};
