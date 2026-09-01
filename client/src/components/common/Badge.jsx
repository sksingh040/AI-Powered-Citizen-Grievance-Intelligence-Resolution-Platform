import React from 'react';
import { getPriorityBadgeClass, getStatusBadgeClass } from '../../utils/formatters';

export const PriorityBadge = ({ band }) => {
  return <span className={`badge ${getPriorityBadgeClass(band)}`}>{band || 'Normal'}</span>;
};

export const StatusBadge = ({ status }) => {
  const formatted = status ? status.replace(/_/g, ' ') : 'Submitted';
  return <span className={`badge ${getStatusBadgeClass(status)}`}>{formatted}</span>;
};
