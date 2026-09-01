import React, { useState, useEffect } from 'react';
import { getIncidentClustersApi, getPublicHotspotsApi } from '../services/api';
import { CivicMap } from '../components/map/CivicMap';
import { DuplicateMergeModal } from '../components/officer/DuplicateMergeModal';
import { PriorityBadge, StatusBadge } from '../components/common/Badge';
import { formatDate } from '../utils/formatters';
import { Layers, GitMerge, MapPin, UserCheck, CheckCircle2, ShieldAlert, ArrowRight } from 'lucide-react';

export const IncidentClustersPage = () => {
  const [clusters, setClusters] = useState([]);
  const [mapPoints, setMapPoints] = useState([]);
  const [showMergeModal, setShowMergeModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [clusterRes, mapRes] = await Promise.all([
        getIncidentClustersApi(),
        getPublicHotspotsApi()
      ]);
      if (clusterRes.data.success) setClusters(clusterRes.data.data.clusters);
      if (mapRes.data.success) setMapPoints(mapRes.data.data.points);
    } catch (err) {
      console.warn('Error fetching clusters:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--saffron-600)', marginBottom: '0.35rem' }}>
              <Layers size={22} />
              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
                Incident Clusters & Duplicate Intelligence
              </h2>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
              Geospatially aggregated multi-ticket hotspots assigned to a single Incident Commander to prevent redundant field dispatches.
            </p>
          </div>

          <button
            onClick={() => setShowMergeModal(true)}
            className="btn btn-saffron"
            style={{ padding: '0.75rem 1.25rem' }}
          >
            <GitMerge size={16} />
            <span>Group Duplicate Tickets</span>
          </button>
        </div>
      </div>

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
          Active Geospatial Incident Radii & Hotspot Centroids
        </h3>
        <CivicMap points={mapPoints} clusters={clusters} height="400px" />
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <h3 style={{ fontSize: '1.2rem', fontWeight: 800 }}>Master Incident Clusters</h3>

        {clusters.length === 0 ? (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No active incident clusters currently formed.
          </div>
        ) : (
          clusters.map((cluster) => (
            <div key={cluster.clusterCode} className="glass-card" style={{ padding: '1.75rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontWeight: 900, fontSize: '1.1rem', color: 'var(--saffron-600)' }}>
                      {cluster.clusterCode}
                    </span>
                    <PriorityBadge band={cluster.severityBand || 'High'} />
                    <StatusBadge status={cluster.status} />
                  </div>
                  <h4 style={{ fontSize: '1.25rem', fontWeight: 800, marginTop: '0.35rem' }}>
                    {cluster.title}
                  </h4>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Department Owner</div>
                  <div style={{ fontWeight: 700 }}>{cluster.department}</div>
                </div>
              </div>

              <div style={{ padding: '1rem', background: 'var(--bg-surface-elevated)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-subtle)', marginBottom: '1rem', fontSize: '0.85rem' }}>
                <div style={{ fontWeight: 600, color: 'var(--text-muted)', marginBottom: '0.2rem' }}>Clustering Rationale & Root Cause:</div>
                <div style={{ color: 'var(--text-primary)', fontStyle: 'italic' }}>
                  "{cluster.summaryRationale}"
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', flexWrap: 'wrap', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <MapPin size={15} color="var(--primary-600)" />
                  <span>Centroid: {cluster.centroid?.ward || 'Ward-12'} (Radius: {cluster.radiusMeters || 250}m)</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                  <UserCheck size={15} color="var(--emerald-600)" />
                  <span>Incident Commander: {cluster.incidentCommander?.name || 'Supervisor'}</span>
                </div>
              </div>

              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '0.85rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
                  Linked Citizen Grievance Tickets ({cluster.complaintTickets?.length || 0}):
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {cluster.complaintTickets?.map((tId, tIdx) => (
                    <span
                      key={tIdx}
                      style={{
                        padding: '0.3rem 0.65rem',
                        borderRadius: 'var(--radius-sm)',
                        background: tIdx === 0 ? 'var(--primary-50)' : 'var(--bg-surface-elevated)',
                        color: tIdx === 0 ? 'var(--primary-700)' : 'var(--text-primary)',
                        border: '1px solid var(--border-subtle)',
                        fontSize: '0.78rem',
                        fontWeight: 700
                      }}
                    >
                      {tIdx === 0 ? `★ Master: ${tId}` : `🔗 Duplicate: ${tId}`}
                    </span>
                  ))}
                </div>
              </div>

            </div>
          ))
        )}
      </div>

      <DuplicateMergeModal
        isOpen={showMergeModal}
        onClose={() => setShowMergeModal(false)}
        queue={[]}
        onClusterCreated={() => {
          setShowMergeModal(false);
          fetchData();
        }}
      />

    </div>
  );
};
