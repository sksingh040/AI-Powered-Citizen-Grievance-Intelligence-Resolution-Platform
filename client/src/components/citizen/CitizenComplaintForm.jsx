import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { useAuth } from '../../context/AuthContext';
import { AudioRecorder } from '../common/AudioRecorder';
import { GeoLocationPicker } from '../common/GeoLocationPicker';
import { FileUpload } from '../common/FileUpload';
import { PriorityBadge } from '../common/Badge';
import { createComplaintApi, getAiTriagePreviewApi } from '../../services/api';
import {
  Send,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  UserCheck,
  CheckCircle,
  HelpCircle,
  Clock
} from 'lucide-react';

export const CitizenComplaintForm = ({ onComplaintCreated }) => {
  const { language, setLanguage, t, supportedLanguages } = useLanguage();
  const { user } = useAuth();

  const [text, setText] = useState('');
  const [media, setMedia] = useState([]);
  const [voiceData, setVoiceData] = useState(null);
  const [location, setLocation] = useState({ lat: 28.5672, lng: 77.2100, address: '', landmark: '' });
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [reporterName, setReporterName] = useState(user?.name || 'Ramesh Sharma');
  const [reporterPhone, setReporterPhone] = useState(user?.phone || '+91 98765 43210');
  const [consentGiven, setConsentGiven] = useState(true);

  const [loading, setLoading] = useState(false);
  const [aiPreview, setAiPreview] = useState(null);
  const [createdTicket, setCreatedTicket] = useState(null);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (text.trim().length > 5 || voiceData?.audioUrl || media.length > 0) {
        try {
          const res = await getAiTriagePreviewApi({
            text: text || voiceData?.transcript || '',
            language,
            lat: location.lat,
            lng: location.lng,
            imageUrl: media[0]?.url || null,
            audioUrl: voiceData?.audioUrl || null
          });
          if (res.data.success) {
            setAiPreview(res.data.data);
          }
        } catch (err) {
          console.warn('AI preview fetch error:', err);
        }
      }
    }, 600);

    return () => clearTimeout(timer);
  }, [text, language, location, media, voiceData]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!text && !voiceData?.audioUrl) {
      alert('Please describe your grievance or record a voice note.');
      return;
    }
    if (!consentGiven) {
      alert('Please accept the citizen consent statement.');
      return;
    }

    try {
      setLoading(true);
      const payload = {
        originalText: text || voiceData?.transcript || 'Voice grievance filed',
        language,
        location,
        media,
        voiceRecording: voiceData,
        reporter: {
          name: isAnonymous ? 'Anonymous Citizen' : reporterName,
          phone: reporterPhone,
          isAnonymous
        },
        intakeChannel: voiceData?.audioUrl ? 'voice_bot' : 'web'
      };

      const res = await createComplaintApi(payload);
      if (res.data.success) {
        setCreatedTicket(res.data.data);
        if (onComplaintCreated) onComplaintCreated(res.data.data);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Error filing grievance. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setText('');
    setMedia([]);
    setVoiceData(null);
    setAiPreview(null);
    setCreatedTicket(null);
  };

  if (createdTicket) {
    return (
      <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
        <div
          style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            background: 'var(--emerald-500)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.5rem'
          }}
        >
          <CheckCircle size={36} />
        </div>
        <h2 style={{ fontSize: '1.75rem', marginBottom: '0.5rem' }}>{t('ticketGenerated')}</h2>
        <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
          Your grievance has been safely registered and assigned to the responsible department.
        </p>

        <div
          style={{
            background: 'var(--bg-surface-elevated)',
            border: '1px dashed var(--primary-500)',
            borderRadius: 'var(--radius-lg)',
            padding: '1.5rem',
            maxWidth: '480px',
            margin: '0 auto 1.5rem'
          }}
        >
          <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
            {t('yourTicketId')}
          </div>
          <div style={{ fontSize: '1.85rem', fontWeight: 900, color: 'var(--primary-600)', letterSpacing: '0.05em' }}>
            {createdTicket.ticketId}
          </div>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '0.75rem', marginTop: '0.75rem' }}>
            <PriorityBadge band={createdTicket.complaint?.priority?.band || 'Normal'} />
            <span className="badge badge-normal">{createdTicket.complaint?.departmentName}</span>
          </div>
        </div>

        {createdTicket.duplicateWarning && (
          <div
            style={{
              padding: '0.85rem 1.25rem',
              borderRadius: 'var(--radius-md)',
              background: 'var(--priority-high-bg)',
              color: 'var(--priority-high)',
              border: '1px solid rgba(249, 115, 22, 0.3)',
              marginBottom: '1.5rem',
              fontSize: '0.85rem'
            }}
          >
            <AlertTriangle size={16} style={{ display: 'inline', marginRight: '0.4rem', verticalAlign: 'middle' }} />
            {createdTicket.duplicateWarning}
          </div>
        )}

        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button onClick={handleReset} className="btn btn-secondary">
            File Another Grievance
          </button>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem' }}>
      
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>{t('fileGrievance')}</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>{t('welcomeCitizen')}</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
          <span style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-muted)' }}>Input Language:</span>
          {supportedLanguages.map((lang) => (
            <button
              key={lang.code}
              type="button"
              onClick={() => setLanguage(lang.code)}
              style={{
                padding: '0.3rem 0.65rem',
                fontSize: '0.75rem',
                fontWeight: 600,
                borderRadius: 'var(--radius-full)',
                border: '1px solid var(--border-subtle)',
                background: language === lang.code ? 'var(--primary-600)' : 'var(--bg-surface)',
                color: language === lang.code ? '#ffffff' : 'var(--text-secondary)',
                cursor: 'pointer'
              }}
            >
              {lang.label}
            </button>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        
        <div>
          <label className="form-label">{t('describeIssue')}</label>
          <textarea
            rows={4}
            className="form-control"
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={
              language === 'hi'
                ? 'उदा. सड़क पर बड़ा गड्ढा है और पानी भर गया है, जिससे दुर्घटना हो सकती है...'
                : 'e.g. Deep pothole on main road near metro station causing serious traffic hazard...'
            }
          />
          
          <AudioRecorder
            language={language}
            onRecordingComplete={(rec) => {
              setVoiceData(rec);
              if (!text) setText(rec.transcript);
            }}
          />
        </div>

        <FileUpload onFilesSelected={(files) => setMedia(files)} />

        <GeoLocationPicker onLocationChange={(loc) => setLocation(loc)} />

        {aiPreview && (
          <div
            style={{
              padding: '1.25rem',
              borderRadius: 'var(--radius-lg)',
              background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08), rgba(255, 119, 0, 0.08))',
              border: '1px solid rgba(59, 130, 246, 0.3)',
              boxShadow: 'var(--shadow-md)'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary-600)', fontWeight: 700, fontSize: '0.9rem' }}>
                <Sparkles size={18} />
                <span>Real-Time AI Triage Intelligence (Active Prediction)</span>
              </div>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <PriorityBadge band={aiPreview.estimatedPriority?.band} />
                <span className="badge badge-normal">Score: {aiPreview.estimatedPriority?.score}/100</span>
              </div>
            </div>

            <div className="grid-2" style={{ gap: '1rem', fontSize: '0.82rem' }}>
              <div>
                <div style={{ color: 'var(--text-muted)' }}>Predicted Department:</div>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.15rem' }}>
                  {aiPreview.aiInference?.departmentName} ({aiPreview.aiInference?.predictedDepartment})
                </div>
                <div style={{ color: 'var(--text-muted)', marginTop: '0.4rem' }}>Confidence:</div>
                <div style={{ fontWeight: 700, color: 'var(--emerald-600)' }}>
                  {Math.round((aiPreview.aiInference?.confidenceScore || 0.9) * 100)}% Confidence
                </div>
              </div>

              <div>
                <div style={{ color: 'var(--text-muted)' }}>AI Rationale & Visual Cues:</div>
                <div style={{ fontStyle: 'italic', color: 'var(--text-secondary)', marginTop: '0.15rem' }}>
                  \"{aiPreview.aiInference?.rationale}\"
                </div>
                {aiPreview.geoEnrichment?.sensitiveZone?.isSensitive && (
                  <div style={{ color: 'var(--rose-600)', fontWeight: 600, marginTop: '0.4rem' }}>
                    🚨 Proximity alert: Near {aiPreview.geoEnrichment.sensitiveZone.name} (+20 priority)
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        <div
          style={{
            padding: '1.25rem',
            borderRadius: 'var(--radius-md)',
            background: 'var(--bg-surface-elevated)',
            border: '1px solid var(--border-subtle)'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
            <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Reporter Contact & Privacy Mode</span>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <span>Report Anonymously (Hide identity on public records)</span>
            </label>
          </div>

          {!isAnonymous && (
            <div className="grid-2" style={{ gap: '0.75rem' }}>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Full Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={reporterName}
                  onChange={(e) => setReporterName(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
              <div>
                <label className="form-label" style={{ fontSize: '0.75rem' }}>Phone Number (for SMS Tracking)</label>
                <input
                  type="text"
                  className="form-control"
                  value={reporterPhone}
                  onChange={(e) => setReporterPhone(e.target.value)}
                  style={{ fontSize: '0.85rem' }}
                />
              </div>
            </div>
          )}

          <div style={{ marginTop: '0.75rem' }}>
            <label style={{ display: 'flex', alignItems: 'flex-start', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <input
                type="checkbox"
                checked={consentGiven}
                onChange={(e) => setConsentGiven(e.target.checked)}
                style={{ marginTop: '0.2rem' }}
              />
              <span>
                I consent to providing the civic description, GPS coordinates, and media for municipal inspection and SLA-based remediation per privacy policy.
              </span>
            </label>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="btn btn-primary"
          style={{ padding: '0.9rem 1.5rem', fontSize: '1rem', fontWeight: 700, borderRadius: 'var(--radius-lg)' }}
        >
          {loading ? (
            <span>{t('submitting')}</span>
          ) : (
            <>
              <Send size={18} />
              <span>{t('submitReport')}</span>
            </>
          )}
        </button>

      </div>
    </form>
  );
};
