import React, { useState } from 'react';
import { Modal } from '../common/Modal';
import { submitFeedbackApi } from '../../services/api';
import { Star, AlertOctagon, CheckCircle2 } from 'lucide-react';

export const FeedbackModal = ({ isOpen, onClose, ticketId, onFeedbackSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isContesting, setIsContesting] = useState(false);
  const [reopenReason, setReopenReason] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isContesting && !reopenReason.trim()) {
      alert('Please provide the reason why the resolution is incomplete.');
      return;
    }

    try {
      setSubmitting(true);
      const res = await submitFeedbackApi(ticketId, {
        rating: isContesting ? 1 : rating,
        comment,
        isContested: isContesting,
        reopenReason: isContesting ? reopenReason : null
      });

      if (res.data.success) {
        if (onFeedbackSubmitted) onFeedbackSubmitted(res.data.data.complaint);
        onClose();
      }
    } catch (err) {\n      alert(err.response?.data?.message || 'Error submitting feedback.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Citizen Verification for ${ticketId}`}>
      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        
        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            type="button"
            onClick={() => setIsContesting(false)}
            className={`btn ${!isContesting ? 'btn-success' : 'btn-secondary'}`}
            style={{ flex: 1 }}
          >
            <CheckCircle2 size={16} />
            <span>Satisfied / Close Ticket</span>
          </button>
          <button
            type="button"
            onClick={() => setIsContesting(true)}
            className={`btn ${isContesting ? 'btn-danger' : 'btn-secondary'}`}
            style={{ flex: 1 }}
          >
            <AlertOctagon size={16} />
            <span>Contest / Reopen</span>
          </button>
        </div>

        {!isContesting ? (
          <div>
            <label className="form-label" style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
              Rate your resolution experience (1 to 5 Stars)
            </label>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHoverRating(star)}
                  onMouseLeave={() => setHoverRating(0)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '0.25rem',
                    color: star <= (hoverRating || rating) ? '#f59e0b' : 'var(--border-subtle)',
                    transition: 'transform 0.15s ease'
                  }}
                >
                  <Star size={32} fill={star <= (hoverRating || rating) ? '#f59e0b' : 'none'} />
                </button>
              ))}
            </div>

            <div style={{ marginTop: '1rem' }}>
              <label className="form-label">Citizen Feedback / Remarks</label>
              <textarea
                rows={3}
                className="form-control"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with the municipal crew..."
              />
            </div>
          </div>
        ) : (
          <div>
            <div
              style={{
                padding: '0.75rem',
                borderRadius: 'var(--radius-sm)',
                background: 'var(--priority-critical-bg)',
                color: 'var(--priority-critical)',
                fontSize: '0.82rem',
                marginBottom: '1rem'
              }}
            >
              Notice: Contesting the resolution will reopen the ticket and escalate it directly to the Department Supervisor for re-inspection.
            </div>

            <label className="form-label">Explain why the issue is not satisfactorily resolved *</label>
            <textarea
              rows={3}
              required
              className="form-control"
              value={reopenReason}
              onChange={(e) => setReopenReason(e.target.value)}
              placeholder="e.g. The pothole was only partially filled and water is still accumulating..."
            />
          </div>
        )}

        <button
          type="submit"
          disabled={submitting}
          className={`btn ${isContesting ? 'btn-danger' : 'btn-primary'}`}
          style={{ marginTop: '0.5rem', padding: '0.75rem' }}
        >
          {submitting ? 'Submitting...' : isContesting ? 'Submit Dispute & Reopen' : 'Confirm Resolution'}
        </button>

      </form>
    </Modal>
  );
};
