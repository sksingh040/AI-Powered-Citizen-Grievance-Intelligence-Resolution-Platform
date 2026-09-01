import React, { useState, useEffect } from 'react';
import { getAnalyticsSummaryApi, getPublicHotspotsApi } from '../services/api';
import { StatCard } from '../components/common/StatCard';
import { DepartmentMetrics } from '../components/admin/DepartmentMetrics';
import { HotspotAnalytics } from '../components/admin/HotspotAnalytics';
import { CivicMap } from '../components/map/CivicMap';
import {
  BarChart3,
  TrendingUp,
  Clock,
  ShieldCheck,
  Zap,
  Flame,
  ThumbsUp,
  Layers
} from 'lucide-react';

export const AdminAnalyticsPage = () => {
  const [data, setData] = useState({
    kpi: {
      totalComplaints: 0,
      resolvedCount: 0,
      inProgressCount: 0,
      criticalCount: 0,
      slaComplianceRate: '94%',
      meanResolutionHours: '18.4 hrs',
      duplicateReductionRate: '38%',
      citizenSatisfaction: '4.8 / 5.0'
    },
    departmentMetrics: [],
    categoryDistribution: [],
    wardHotspots: []
  });
  const [mapData, setMapData] = useState({ points: [], clusters: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [res, mapRes] = await Promise.all([
          getAnalyticsSummaryApi(),
          getPublicHotspotsApi()
        ]);
        if (res.data.success) setData(res.data.data);
        if (mapRes.data.success) setMapData(mapRes.data.data);
      } catch (err) {
        console.warn('Analytics fetch error:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      
      <div className="glass-card" style={{ padding: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--primary-600)', marginBottom: '0.35rem' }}>
          <BarChart3 size={22} />
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)' }}>
            Municipal Executive Analytics & SLA Intelligence
          </h2>
        </div>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Aggregated civic governance metrics, predictive SLA compliance forecasting, and root-cause hotspot trends.
        </p>
      </div>

      <div className="grid-4" style={{ gap: '1.25rem' }}>
        <StatCard
          title="Total Registered"
          value={data.kpi.totalComplaints}
          subtitle="Cross-channel citizen reports"
          icon={TrendingUp}
          color="blue"
        />
        <StatCard
          title="SLA Compliance Rate"
          value={data.kpi.slaComplianceRate}
          subtitle="Resolved within statutory limits"
          icon={ShieldCheck}
          color="emerald"
        />
        <StatCard
          title="Mean Resolution Time"
          value={data.kpi.meanResolutionHours}
          subtitle="Median turnaround window"
          icon={Clock}
          color="saffron"
        />
        <StatCard
          title="Duplicate Workload Reduced"
          value={data.kpi.duplicateReductionRate}
          subtitle="Merged via spatial clustering"
          icon={Layers}
          color="purple"
        />
      </div>

      <div className="grid-4" style={{ gap: '1.25rem' }}>
        <StatCard
          title="Citizen Satisfaction (CSAT)"
          value={data.kpi.citizenSatisfaction}
          subtitle="Post-remediation verification"
          icon={ThumbsUp}
          color="emerald"
        />
        <StatCard
          title="In Remediation Progress"
          value={data.kpi.inProgressCount}
          subtitle="Assigned field work orders"
          icon={Zap}
          color="saffron"
        />
        <StatCard
          title="Critical Priority Cases"
          value={data.kpi.criticalCount}
          subtitle="High hazard / sensitive zones"
          icon={Flame}
          color="rose"
        />
        <StatCard
          title="Active Incident Clusters"
          value={mapData.clusters.length}
          subtitle="Multi-report hotspots"
          icon={Layers}
          color="blue"
        />
      </div>

      <DepartmentMetrics departmentMetrics={data.departmentMetrics} />

      <HotspotAnalytics
        wardHotspots={data.wardHotspots}
        categoryDistribution={data.categoryDistribution}
      />

      <div className="glass-card" style={{ padding: '1.5rem' }}>
        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, marginBottom: '1rem' }}>
          Geospatial Grievance Density Map
        </h3>
        <CivicMap points={mapData.points} clusters={mapData.clusters} height="440px" />
      </div>

    </div>
  );
};
