import React, { useState } from 'react';
import { Camera, Image as ImageIcon, UploadCloud, CheckCircle2, X } from 'lucide-react';
import { uploadMediaApi } from '../../services/api';

export const FileUpload = ({ onFilesSelected }) => {
  const [mediaList, setMediaList] = useState([]);
  const [uploading, setUploading] = useState(false);

  const sampleDemoImages = [
    {
      title: 'Pothole on Main Road',
      url: 'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=60'
    },
    {
      title: 'Overflowing Sewage Drain',
      url: 'https://images.unsplash.com/photo-1599839575945-a9e5af0c3fa5?w=800&auto=format&fit=crop&q=60'
    },
    {
      title: 'Hanging Live Wire',
      url: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?w=800&auto=format&fit=crop&q=60'
    },
    {
      title: 'Broken Streetlight',
      url: 'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=60'
    }
  ];

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    try {
      setUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      const res = await uploadMediaApi(formData);
      if (res.data.success) {
        const newMedia = {
          url: res.data.data.url,
          type: res.data.data.type,
          caption: file.name
        };
        const updated = [...mediaList, newMedia];
        setMediaList(updated);
        onFilesSelected(updated);
      }
    } catch (err) {
      console.warn('Backend upload failed, using local object preview');
      const localUrl = URL.createObjectURL(file);
      const newMedia = { url: localUrl, type: 'image', caption: file.name };
      const updated = [...mediaList, newMedia];
      setMediaList(updated);
      onFilesSelected(updated);
    } finally {
      setUploading(false);
    }
  };

  const handleSelectSample = (sample) => {
    const newMedia = { url: sample.url, type: 'image', caption: sample.title };
    const updated = [...mediaList, newMedia];
    setMediaList(updated);
    onFilesSelected(updated);
  };

  const removeMedia = (index) => {
    const updated = mediaList.filter((_, i) => i !== index);
    setMediaList(updated);
    onFilesSelected(updated);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
        <Camera size={16} color="var(--emerald-500)" />
        <span>Photo Evidence & Civic Vision Analysis</span>
      </label>

      <div
        style={{
          border: '2px dashed var(--border-subtle)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          textAlign: 'center',
          background: 'var(--bg-surface-elevated)',
          position: 'relative',
          cursor: 'pointer'
        }}
      >
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0,
            cursor: 'pointer'
          }}
        />
        <UploadCloud size={28} color="var(--primary-500)" style={{ margin: '0 auto 0.5rem' }} />
        <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
          {uploading ? 'Analyzing Image...' : 'Click to Upload or Drag Photo'}
        </div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          JPG, PNG, WebP up to 25MB (GPS metadata parsed automatically)
        </div>
      </div>

      <div>
        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.4rem' }}>
          Or select a sample test image:
        </div>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          {sampleDemoImages.map((s, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => handleSelectSample(s)}
              className="btn btn-secondary"
              style={{ fontSize: '0.72rem', padding: '0.25rem 0.6rem', borderRadius: 'var(--radius-full)' }}
            >
              <ImageIcon size={12} />
              <span>{s.title}</span>
            </button>
          ))}
        </div>
      </div>

      {mediaList.length > 0 && (
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
          {mediaList.map((m, idx) => (
            <div
              key={idx}
              style={{
                position: 'relative',
                width: '100px',
                height: '100px',
                borderRadius: 'var(--radius-md)',
                overflow: 'hidden',
                border: '2px solid var(--primary-500)'
              }}
            >
              <img src={m.url} alt="Evidence" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              <button
                type="button"
                onClick={() => removeMedia(idx)}
                style={{
                  position: 'absolute',
                  top: '4px',
                  right: '4px',
                  background: 'rgba(0,0,0,0.6)',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '50%',
                  width: '20px',
                  height: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
