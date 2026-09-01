import React from 'react';
import { ShieldCheck, TrendingUp, Clock, AlertCircle } from 'lucide-react';

export const DepartmentMetrics = ({ departmentMetrics = [] }) => {
  return (\n    <div className=\"glass-card\" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h3 style={{ fontSize: '1.15rem', fontWeight: 800 }}>Departmental SLA & Workload Adherence</h3>
          <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
            Real-time tracking of resolution efficiency across municipal departments.
          </p>
        </div>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.84rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--border-subtle)', color: 'var(--text-secondary)', textAlign: 'left' }}>
              <th style={{ padding: '0.75rem', fontWeight: 700 }}>Department</th>
              <th style={{ padding: '0.75rem', fontWeight: 700 }}>Total Complaints</th>
              <th style={{ padding: '0.75rem', fontWeight: 700 }}>Resolved</th>
              <th style={{ padding: '0.75rem', fontWeight: 700 }}>Pending</th>
              <th style={{ padding: '0.75rem', fontWeight: 700 }}>SLA Adherence</th>
            </tr>
          </thead>
          <tbody>
            {departmentMetrics.map((dept) => {
              const adherence = dept.slaAdherence || 92;
              const isHigh = adherence >= 85;
              return (
                <tr key={dept.deptId} style={{ borderBottom: '1px solid var(--border-subtle)' }}>
                  <td style={{ padding: '0.75rem', fontWeight: 600 }}>
                    <div>{dept.deptName}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Code: {dept.code}</div>
                  </td>
                  <td style={{ padding: '0.75rem', fontWeight: 700 }}>{dept.total}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--emerald-600)', fontWeight: 700 }}>{dept.resolved}</td>
                  <td style={{ padding: '0.75rem', color: 'var(--amber-500)', fontWeight: 700 }}>{dept.pending}</td>
                  <td style={{ padding: '0.75rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <div
                        style={{
                          flex: 1,
                          height: '8px',
                          background: 'var(--border-subtle)',
                          borderRadius: 'var(--radius-full)',
                          overflow: 'hidden'
                        }}
                      >
                        <div
                          style={{
                            width: `${adherence}%`,
                            height: '100%',
                            background: isHigh ? 'var(--emerald-500)' : 'var(--rose-500)',
                            borderRadius: 'var(--radius-full)'
                          }}
                        />
                      </div>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, minWidth: '36px' }}>{adherence}%</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};
