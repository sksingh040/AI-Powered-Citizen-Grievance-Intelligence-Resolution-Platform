import React from 'react';
import { CheckCircle2, ShieldCheck, FileCheck2, Camera } from 'lucide-react';

export const EvidenceViewer = ({ resolution = {}, submissionMedia = [] }) => {
  const beforePhoto = resolution?.beforePhotoUrl || submissionMedia.find((m) => m.stage === 'submission')?.url;
  const afterPhoto = resolution?.afterPhotoUrl;

  return (
    <div
      style={{
        padding: '1.5rem',
        borderRadius: 'var(--radius-lg)',
        background: 'var(--bg-surface-elevated)',
        border: '1px solid var(--border-subtle)',
        marginTop: '1.25rem'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--emerald-600)', fontWeight: 700 }}>
          <ShieldCheck size={20} />
          <span>Evidence-Based Resolution Trail</span>
        </div>
        {resolution.workOrderRef && (
          <span className="badge badge-normal">WO Ref: {resolution.workOrderRef}</span>
        )}
      </div>

      <div className="grid-2" style={{ gap: '1.25rem' }}>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <Camera size={14} color="var(--rose-500)" />
            <span>Before (Citizen Submission)</span>
          </div>
          {beforePhoto ? (
            <div style={{ height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
              <img src={beforePhoto} alt="Before" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ height: '180px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              No photo uploaded at submission
            </div>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--emerald-600)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
            <FileCheck2 size={14} color="var(--emerald-500)" />
            <span>After (Remediation Proof)</span>
          </div>
          {afterPhoto ? (
            <div style={{ height: '180px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '2px solid var(--emerald-500)' }}>
              <img src={afterPhoto} alt="After Remediation" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
          ) : (
            <div style={{ height: '180px', borderRadius: 'var(--radius-md)', background: 'var(--bg-surface)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
              Pending field resolution photo upload
            </div>
          )}
        </div>

      </div>

      {resolution.closureNotes && (
        <div style={{ marginTop: '1rem', padding: '0.85rem 1rem', borderRadius: 'var(--radius-sm)', background: 'var(--bg-glass)', fontSize: '0.84rem' }}>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>Officer Closure Note: </span>
          <span style={{ color: 'var(--text-primary)' }}>\"{resolution.closureNotes}\"</span>
        </div>
      )}

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1.5rem', flexWrap: 'wrap', fontSize: '0.78rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: resolution.verificationChecklist?.siteInspected ? 'var(--emerald-600)' : 'var(--text-muted)' }}>
          <CheckCircle2 size={15} />
          <span>On-Site Inspection Verified</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: resolution.verificationChecklist?.hazardNeutralized ? 'var(--emerald-600)' : 'var(--text-muted)' }}>
          <CheckCircle2 size={15} />
          <span>Public Hazard Neutralized</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: resolution.verificationChecklist?.photoVerified ? 'var(--emerald-600)' : 'var(--text-muted)' }}>
          <CheckCircle2 size={15} />
          <span>Geo/Time Photo Authenticated</span>
        </div>
      </div>
    </div>
  );
};
