import React from 'react';
import { MapContainer, TileLayer, CircleMarker, Circle, Popup } from 'react-leaflet';
import { PriorityBadge, StatusBadge } from '../common/Badge';
import { ExternalLink, Layers, MapPin } from 'lucide-react';

export const CivicMap = ({ points = [], clusters = [], onSelectTicket, height = '480px' }) => {
  const defaultCenter = [28.6139, 77.2090];

  const getPriorityColor = (band) => {
    switch (band?.toLowerCase()) {
      case 'critical':
        return '#ef4444';
      case 'high':
        return '#f97316';
      case 'normal':
        return '#3b82f6';
      case 'low':
        return '#10b981';
      default:
        return '#3b82f6';
    }
  };

  return (
    <div style={{ height, borderRadius: 'var(--radius-lg)', overflow: 'hidden', border: '1px solid var(--border-glass)', position: 'relative' }}>
      <MapContainer center={defaultCenter} zoom={12} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {clusters.map((cluster, idx) => {
          if (!cluster.centroid?.lat || !cluster.centroid?.lng) return null;
          return (
            <React.Fragment key={`cluster-${idx}`}>
              <Circle
                center={[cluster.centroid.lat, cluster.centroid.lng]}
                radius={cluster.radiusMeters || 300}
                pathOptions={{
                  color: '#ea580c',
                  fillColor: '#ea580c',
                  fillOpacity: 0.18,
                  weight: 2,
                  dashArray: '4, 6'
                }}
              />
              <CircleMarker
                center={[cluster.centroid.lat, cluster.centroid.lng]}
                radius={12}
                pathOptions={{
                  color: '#ea580c',
                  fillColor: '#ffffff',
                  fillOpacity: 1,
                  weight: 3
                }}
              >
                <Popup>
                  <div style={{ minWidth: '220px', padding: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: '#ea580c', fontWeight: 700, fontSize: '0.85rem' }}>
                      <Layers size={16} />
                      <span>{cluster.clusterCode}</span>
                    </div>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', marginTop: '0.2rem' }}>{cluster.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {cluster.complaintTickets?.length || 2} Linked Grievances • Commander: {cluster.incidentCommander?.name}
                    </div>
                  </div>
                </Popup>
              </CircleMarker>
            </React.Fragment>
          );
        })}

        {points.map((pt, idx) => {
          if (!pt.lat || !pt.lng) return null;
          const color = getPriorityColor(pt.priorityBand);
          return (
            <CircleMarker
              key={`point-${idx}`}
              center={[pt.lat, pt.lng]}
              radius={8}
              pathOptions={{
                color: '#ffffff',
                fillColor: color,
                fillOpacity: 0.9,
                weight: 2
              }}
            >
              <Popup>
                <div style={{ minWidth: '220px', padding: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <span style={{ fontWeight: 800, fontSize: '0.88rem' }}>{pt.ticketId}</span>
                    <PriorityBadge band={pt.priorityBand} />
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {pt.category?.replace(/_/g, ' ')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', margin: '0.25rem 0' }}>
                    {pt.department} • {pt.ward}
                  </div>
                  {pt.address && (
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      📍 {pt.address}
                    </div>
                  )}
                  {onSelectTicket && (
                    <button
                      type="button"
                      onClick={() => onSelectTicket(pt.ticketId)}
                      style={{
                        marginTop: '0.5rem',
                        width: '100%',
                        padding: '0.35rem',
                        background: 'var(--primary-600)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: 'var(--radius-sm)',
                        fontSize: '0.75rem',
                        cursor: 'pointer',
                        fontWeight: 600
                      }}
                    >
                      View Details & Track
                    </button>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>

      <div
        style={{
          position: 'absolute',
          bottom: '16px',
          left: '16px',
          zIndex: 1000,
          background: 'var(--bg-glass)',
          backdropFilter: 'blur(12px)',
          border: '1px solid var(--border-glass)',
          borderRadius: 'var(--radius-md)',
          padding: '0.6rem 0.85rem',
          fontSize: '0.75rem',
          display: 'flex',
          gap: '0.75rem',
          flexWrap: 'wrap',
          boxShadow: 'var(--shadow-md)'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#ef4444' }} />
          <span>Critical</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#f97316' }} />
          <span>High</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' }} />
          <span>Normal</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#10b981' }} />
          <span>Low</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
          <span style={{ width: '12px', height: '12px', borderRadius: '50%', border: '2px dashed #ea580c' }} />
          <span>Incident Cluster</span>
        </div>
      </div>
    </div>
  );
};
