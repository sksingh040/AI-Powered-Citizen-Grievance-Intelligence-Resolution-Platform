import React, { useState, useEffect } from 'react';
import { getOfficerQueueApi } from '../services/api';
import { OfficerQueueTable } from '../components/officer/OfficerQueueTable';
import { ComplaintDetailModal } from '../components/officer/ComplaintDetailModal';
import { EvidenceClosureModal } from '../components/officer/EvidenceClosureModal';
import { DuplicateMergeModal } from '../components/officer/DuplicateMergeModal';
import { useAuth } from '../context/AuthContext';
import { DEPARTMENTS } from '../utils/constants';
import {
  LayoutDashboard,
  Filter,
  Search,
  RefreshCw,
  GitMerge,
  AlertTriangle,
  Clock,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

export const OfficerDashboardPage = () => {
  const { user } = useAuth();
  const [queue, setQueue] = useState([]);
  const [counts, setCounts] = useState({ total: 0, critical: 0, triageNeeded: 0, inProgress: 0, slaOverdue: 0, resolved: 0 });
  const [loading, setLoading] = useState(false);

  const [filterStatus, setFilterStatus] = useState('');
  const [filterPriority, setFilterPriority] = useState('');
  const [filterDept, setFilterDept] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const [selectedComplaint, setSelectedComplaint] = useState(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEvidenceModal, setShowEvidenceModal] = useState(false);
  const [showMergeModal, setShowMergeModal] = useState(false);

  const fetchQueue = async () => {
    try {
      setLoading(true);
      const res = await getOfficerQueueApi({
        status: filterStatus || undefined,
        priorityBand: filterPriority || undefined,
        department: filterDept || undefined,
        search: searchQuery || undefined
      });
      if (res.data.success) {
        setQueue(res.data.data.queue);
        setCounts(res.data.data.counts);
      }
    } catch (err) {
      console.warn('Queue fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQueue();
  }, [filterStatus, filterPriority, filterDept]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchQueue();
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      
      <div className="glass-card" style={{ padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <LayoutDashboard size={22} color="var(--primary-600)" />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Municipal Officer Operations Queue</h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Logged in as: <strong>{user?.name || 'Authorized Official'}</strong> ({user?.role || 'field_officer'}) • Ward Jurisdiction: {user?.ward || 'All Wards'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.6rem' }}>
            <button
              onClick={() => setShowMergeModal(true)}
              className="btn btn-saffron"
              style={{ fontSize: '0.8rem', padding: '0.5rem 1rem' }}
            >
              <GitMerge size={15} />
              <span>Merge Duplicates into Cluster</span>
            </button>
            <button
              onClick={fetchQueue}
              className="btn btn-secondary"
              style={{ fontSize: '0.8rem', padding: '0.5rem 0.85rem' }}
              title="Refresh Queue"
            >
              <RefreshCw size={15} className={loading ? 'pulse-recording' : ''} />
            </button>
          </div>
        </div>

        <div className="grid-4" style={{ gap: '0.85rem' }}>
          <div
            onClick={() => setFilterPriority('Critical')}
            style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--priority-critical-bg)', border: '1px solid rgba(239, 68, 68, 0.3)', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--priority-critical)' }}>{counts.critical}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--priority-critical)' }}>Critical Priority</div>
          </div>

          <div
            onClick={() => setFilterStatus('ai_triaged')}
            style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--primary-50)', border: '1px solid var(--primary-100)', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-700)' }}>{counts.triageNeeded}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--primary-700)' }}>Triage Review Needed</div>
          </div>

          <div
            onClick={() => setFilterStatus('in_progress')}
            style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--priority-high-bg)', border: '1px solid rgba(249, 115, 22, 0.3)', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--priority-high)' }}>{counts.inProgress}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--priority-high)' }}>In Remediation Progress</div>
          </div>

          <div
            onClick={() => setFilterStatus('resolved')}
            style={{ padding: '0.85rem', borderRadius: 'var(--radius-md)', background: 'var(--priority-low-bg)', border: '1px solid rgba(16, 185, 129, 0.3)', cursor: 'pointer' }}
          >
            <div style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--emerald-600)' }}>{counts.resolved}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--emerald-600)' }}>Resolved / Closed</div>
          </div>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.25rem' }}>
        <form onSubmit={handleSearchSubmit} style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          
          <div style={{ flex: 1, minWidth: '220px', display: 'flex', alignItems: 'center', position: 'relative' }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: '12px' }} />
            <input
              type="text"
              className="form-control"
              placeholder="Search by ticket ID, category, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: '2.25rem', fontSize: '0.85rem' }}
            />
          </div>

          <select
            className="form-control"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            style={{ width: 'auto', minWidth: '140px', fontSize: '0.85rem' }}
          >
            <option value="">All Statuses</option>
            <option value="submitted">Submitted</option>
            <option value="ai_triaged">AI Triaged</option>
            <option value="assigned">Assigned</option>
            <option value="in_progress">In Progress</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
            <option value="reopened">Reopened</option>
          </select>

          <select
            className="form-control"
            value={filterPriority}
            onChange={(e) => setFilterPriority(e.target.value)}
            style={{ width: 'auto', minWidth: '140px', fontSize: '0.85rem' }}
          >
            <option value="">All Priorities</option>
            <option value="Critical">Critical</option>
            <option value="High">High</option>
            <option value="Normal">Normal</option>
            <option value="Low">Low</option>
          </select>

          <select
            className="form-control"
            value={filterDept}
            onChange={(e) => setFilterDept(e.target.value)}
            style={{ width: 'auto', minWidth: '160px', fontSize: '0.85rem' }}
          >
            <option value="">All Departments</option>
            {DEPARTMENTS.map((d) => (
              <option key={d.id} value={d.id}>{d.name}</option>
            ))}
          </select>

          <button type="submit" className="btn btn-primary" style={{ padding: '0.65rem 1.1rem' }}>
            Filter
          </button>
        </form>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <OfficerQueueTable
          queue={queue}
          onViewDetail={(c) => {
            setSelectedComplaint(c);
            setShowDetailModal(true);
          }}
          onResolveEvidence={(c) => {
            setSelectedComplaint(c);
            setShowEvidenceModal(true);
          }}
          onOverrideTriage={(c) => {
            setSelectedComplaint(c);
            setShowDetailModal(true);
          }}
          onUpdateStatus={fetchQueue}
        />
      </div>

      {selectedComplaint && (
        <>
          <ComplaintDetailModal
            isOpen={showDetailModal}
            onClose={() => setShowDetailModal(false)}
            complaint={selectedComplaint}
            onComplaintUpdated={() => {
              setShowDetailModal(false);
              fetchQueue();
            }}
          />

          <EvidenceClosureModal
            isOpen={showEvidenceModal}
            onClose={() => setShowEvidenceModal(false)}
            complaint={selectedComplaint}
            onComplaintResolved={() => {
              setShowEvidenceModal(false);
              fetchQueue();
            }}
          />
        </>
      )}

      <DuplicateMergeModal
        isOpen={showMergeModal}
        onClose={() => setShowMergeModal(false)}
        queue={queue}
        onClusterCreated={() => {
          setShowMergeModal(false);
          fetchQueue();
        }}
      />

    </div>
  );
};
