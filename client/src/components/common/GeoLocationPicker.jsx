import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { MapPin, Navigation, Compass, AlertCircle } from 'lucide-react';

const pinIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34]
});

function LocationMarker({ position, setPosition, onLocationSelected }) {
  useMapEvents({
    click(e) {
      const newPos = { lat: e.latlng.lat, lng: e.latlng.lng };
      setPosition(newPos);
      onLocationSelected(newPos);
    }
  });

  return position === null ? null : <Marker position={[position.lat, position.lng]} icon={pinIcon} />;
}

export const GeoLocationPicker = ({ onLocationChange, initialLocation = { lat: 28.5672, lng: 77.2100 } }) => {
  const [position, setPosition] = useState(initialLocation);
  const [addressInput, setAddressInput] = useState('Ring Road near AIIMS Main Gate, Ansari Nagar, New Delhi');
  const [landmarkInput, setLandmarkInput] = useState('Near AIIMS Metro Gate 2');

  const presetZones = [
    { name: 'AIIMS Corridor (Hospital Zone)', lat: 28.5672, lng: 77.2100, address: 'Ring Road near AIIMS Hospital, New Delhi' },
    { name: 'Karol Bagh Market (Commercial Zone)', lat: 28.6515, lng: 77.1890, address: 'Arya Samaj Road, Karol Bagh, New Delhi' },
    { name: 'Lajpat Nagar Central (Residential Zone)', lat: 28.5700, lng: 77.2400, address: 'Block B Central Avenue, Lajpat Nagar, New Delhi' },
    { name: 'DPS Mathura Road (School Zone)', lat: 28.5950, lng: 77.2280, address: 'Mathura Road near DPS Gate 1, New Delhi' }
  ];

  const handlePresetSelect = (preset) => {
    const newPos = { lat: preset.lat, lng: preset.lng };
    setPosition(newPos);
    setAddressInput(preset.address);
    onLocationChange({
      ...newPos,
      address: preset.address,
      landmark: landmarkInput
    });
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setPosition(newPos);
          setAddressInput('Current GPS Location, New Delhi');
          onLocationChange({ ...newPos, address: 'Current GPS Location', landmark: landmarkInput });
        },
        () => {
          alert('Could not retrieve exact GPS coordinates. Using selected map pin.');
        }
      );
    }
  };

  useEffect(() => {
    onLocationChange({
      lat: position.lat,
      lng: position.lng,
      address: addressInput,
      landmark: landmarkInput
    });
  }, [position, addressInput, landmarkInput]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <label className="form-label" style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
          <MapPin size={16} color="var(--primary-600)" />
          <span>Interactive Location & GIS Pinning</span>
        </label>
        <button
          type="button"
          onClick={handleGetCurrentLocation}
          className="btn btn-secondary"
          style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem', borderRadius: 'var(--radius-full)' }}
        >
          <Navigation size={14} />
          <span>Detect My GPS</span>
        </button>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        {presetZones.map((pz, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => handlePresetSelect(pz)}
            style={{
              fontSize: '0.72rem',
              padding: '0.3rem 0.65rem',
              borderRadius: 'var(--radius-full)',
              background: position.lat === pz.lat ? 'var(--primary-600)' : 'var(--bg-surface-elevated)',
              color: position.lat === pz.lat ? '#ffffff' : 'var(--text-secondary)',
              border: '1px solid var(--border-subtle)',
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            {pz.name}
          </button>
        ))}
      </div>

      <div style={{ height: '240px', borderRadius: 'var(--radius-md)', overflow: 'hidden', border: '1px solid var(--border-subtle)' }}>
        <MapContainer center={[position.lat, position.lng]} zoom={14} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <LocationMarker position={position} setPosition={setPosition} onLocationSelected={(pos) => setPosition(pos)} />
        </MapContainer>
      </div>

      <div className="grid-2" style={{ gap: '0.75rem' }}>
        <div>
          <label className="form-label" style={{ fontSize: '0.75rem' }}>Address / Area</label>
          <input
            type="text"
            className="form-control"
            value={addressInput}
            onChange={(e) => setAddressInput(e.target.value)}
            placeholder="e.g. Ring Road, Ansari Nagar"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
          />
        </div>
        <div>
          <label className="form-label" style={{ fontSize: '0.75rem' }}>Nearest Landmark (Optional)</label>
          <input
            type="text"
            className="form-control"
            value={landmarkInput}
            onChange={(e) => setLandmarkInput(e.target.value)}
            placeholder="e.g. Near Metro Gate 2 / Hospital"
            style={{ fontSize: '0.85rem', padding: '0.5rem 0.75rem' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
        <Compass size={14} />
        <span>Coordinates: {position.lat.toFixed(4)}° N, {position.lng.toFixed(4)}° E (Auto-mapped to Municipal Ward-12)</span>
      </div>
    </div>
  );
};
