export const formatDate = (dateStr) => {
  if (!dateStr) return 'N/A';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};

export const formatTimeRemaining = (deadlineStr) => {
  if (!deadlineStr) return 'No SLA';
  const diff = new Date(deadlineStr) - new Date();
  if (diff <= 0) return 'Overdue (SLA Breached)';
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  return `${hours}h ${mins}m remaining`;
};

export const getPriorityBadgeClass = (band) => {
  switch (band?.toLowerCase()) {
    case 'critical':
      return 'badge-critical';
    case 'high':
      return 'badge-high';
    case 'normal':
      return 'badge-normal';
    case 'low':
      return 'badge-low';
    default:
      return 'badge-normal';
  }
};

export const getStatusBadgeClass = (status) => {
  switch (status?.toLowerCase()) {
    case 'submitted':
    case 'ai_triaged':
      return 'badge-normal';
    case 'assigned':
    case 'in_progress':
      return 'badge-high';
    case 'resolved':
    case 'closed':
      return 'badge-low';
    case 'rejected':
    case 'reopened':
    case 'escalated':
      return 'badge-critical';
    case 'duplicate_linked':
      return 'badge-normal';
    default:
      return 'badge-normal';
  }
};
