import { useState, useCallback, useRef } from 'react';
import Cropper from 'react-easy-crop';

export default function Step2Adjust({ imageSrc, onNext, onBack }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [shape, setShape] = useState('round');
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = useCallback((_, areaPixels) => {
    setCroppedArea(areaPixels);
  }, []);

  return (
    <div className="hhg-panel" style={{ padding: '16px 16px 24px' }}>
      <div className="hhg-step-head" style={{ marginBottom: 14 }}>
        <h2>Adjust Your Photo</h2>
        <p>👆 Drag to reposition · pinch or use slider to zoom</p>
      </div>

      {/* Shape selector */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <div className="shape-btns" style={{ maxWidth: 280, width: '100%' }}>
          <button
            className={`shape-btn ${shape === 'round' ? 'on' : ''}`}
            onClick={() => setShape('round')}
          >
            <span style={{ fontSize: 20 }}>⭕</span> Circle
          </button>
          <button
            className={`shape-btn ${shape === 'rect' ? 'on' : ''}`}
            onClick={() => setShape('rect')}
          >
            <span style={{ fontSize: 20 }}>⬛</span> Square
          </button>
        </div>
      </div>

      {/* Crop Canvas — fixed height so react-easy-crop renders properly */}
      <div
        style={{
          position: 'relative',
          width: '100%',
          maxWidth: 320,
          height: 320,
          margin: '0 auto',
          borderRadius: 18,
          overflow: 'hidden',
          background: '#0a1a0f',
          boxShadow: '0 0 0 3px rgba(232,200,64,0.3), 0 8px 32px rgba(0,0,0,0.5)',
          touchAction: 'none',
        }}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          minZoom={0.1}
          maxZoom={3}
          rotation={rotation}
          aspect={1}
          cropShape={shape === 'round' ? 'round' : 'rect'}
          showGrid={false}
          zoomWithScroll={true}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          objectFit="auto-cover"
          style={{
            containerStyle: {
              borderRadius: 18,
              backgroundColor: '#0a1a0f',
            },
            mediaStyle: {
              transition: 'transform 0.05s linear',
            },
            cropAreaStyle: {
              border: '3px solid rgba(232,200,64,0.9)',
              boxShadow: '0 0 0 9999px rgba(0,0,0,0.55)',
            },
          }}
        />
      </div>

      {/* Controls */}
      <div className="crop-controls" style={{ maxWidth: 320, margin: '18px auto 0' }}>
        {/* Zoom */}
        <div className="crop-row">
          <div className="crop-label">
            <span>🔍 ZOOM</span>
            <span>{zoom.toFixed(1)}×</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" className="btn btn-ghost" style={{ padding: 0, width: 24, height: 24, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}>-</button>
            <input
              className="slider"
              style={{ flex: 1 }}
              type="range"
              min={0.1}
              max={3}
              step={0.05}
              value={zoom}
              onChange={e => setZoom(Number(e.target.value))}
            />
            <button type="button" className="btn btn-ghost" style={{ padding: 0, width: 24, height: 24, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setZoom(z => Math.min(3, z + 0.1))}>+</button>
          </div>
        </div>

        {/* Rotate */}
        <div className="crop-row">
          <div className="crop-label">
            <span>🔄 ROTATE</span>
            <span>{rotation}°</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button type="button" className="btn btn-ghost" style={{ padding: 0, width: 24, height: 24, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setRotation(r => Math.max(-10, r - 1))}>-</button>
            <input
              className="slider"
              style={{ flex: 1 }}
              type="range"
              min={-10}
              max={10}
              step={1}
              value={rotation}
              onChange={e => setRotation(Number(e.target.value))}
            />
            <button type="button" className="btn btn-ghost" style={{ padding: 0, width: 24, height: 24, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={() => setRotation(r => Math.min(10, r + 1))}>+</button>
          </div>
        </div>
      </div>

      {/* Reset button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: 10 }}>
        <button
          className="btn btn-ghost"
          style={{ fontSize: 12, padding: '6px 18px', opacity: 0.7 }}
          onClick={() => { setCrop({ x: 0, y: 0 }); setZoom(1); setRotation(0); }}
        >
          ↺ Reset
        </button>
      </div>

      {/* Nav */}
      <div className="nav-btns" style={{ marginTop: 20 }}>
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button
          className="btn btn-yellow btn-lg"
          onClick={() => onNext({ crop: croppedArea, shape: shape === 'round' ? 'circle' : 'square' })}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
