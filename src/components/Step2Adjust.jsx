import { useState, useCallback } from 'react';
import Cropper from 'react-easy-crop';

export default function Step2Adjust({ imageSrc, onNext, onBack }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [shape, setShape] = useState('round');
  const [croppedArea, setCroppedArea] = useState(null);

  const onCropComplete = useCallback((area) => setCroppedArea(area), []);

  return (
    <div className="hhg-panel">
      <div className="hhg-step-head">
        <h2>Adjust Your Photo</h2>
        <p>Drag to reposition · scroll or pinch to zoom · pick a crop shape.</p>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 14 }}>
        <div className="shape-btns" style={{ maxWidth: 260, width: '100%' }}>
          <button className={`shape-btn ${shape === 'round' ? 'on' : ''}`} onClick={() => setShape('round')}>
            <span style={{ fontSize: 22 }}>⭕</span> Circle
          </button>
          <button className={`shape-btn ${shape === 'rect' ? 'on' : ''}`} onClick={() => setShape('rect')}>
            <span style={{ fontSize: 22 }}>⬛</span> Square
          </button>
        </div>
      </div>

      <div 
        className="crop-box" 
        style={{ width: '100%', maxWidth: '300px', aspectRatio: '1', margin: '0 auto' }}
        onTouchStart={e => e.stopPropagation()}
        onTouchMove={e => e.stopPropagation()}
        onTouchEnd={e => e.stopPropagation()}
        onMouseDown={e => e.stopPropagation()}
        onMouseMove={e => e.stopPropagation()}
        onMouseUp={e => e.stopPropagation()}
      >
        <Cropper
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          minZoom={0.1}
          maxZoom={2}
          rotation={rotation}
          aspect={1}
          cropShape={shape}
          showGrid
          zoomWithScroll={false}
          onCropChange={setCrop}
          onZoomChange={setZoom}
          onCropComplete={onCropComplete}
          style={{
            containerStyle: { borderRadius: 16, backgroundColor: 'transparent' },
            cropAreaStyle: {
              border: '3px solid #0f172a', /* Dark ink border */
              boxShadow: '0 0 0 9999px rgba(15, 23, 42, 0.6)', /* Dark ink overlay */
            },
          }}
        />
      </div>

      <div className="crop-controls">
        <div className="crop-row">
          <div className="crop-label">
            <span>ZOOM</span><span>{zoom.toFixed(1)}×</span>
          </div>
          <input className="slider" type="range" min={0} max={2} step={0.05}
            value={zoom} onChange={e => setZoom(Number(e.target.value))} />
        </div>
        <div className="crop-row">
          <div className="crop-label">
            <span>ROTATE</span><span>{rotation}°</span>
          </div>
          <input className="slider" type="range" min={-180} max={180} step={1}
            value={rotation} onChange={e => setRotation(Number(e.target.value))} />
        </div>
      </div>

      <div className="nav-btns">
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button className="btn btn-yellow btn-lg" onClick={() =>
          onNext({ crop: croppedArea, shape: shape === 'round' ? 'circle' : 'square' })
        }>
          Continue →
        </button>
      </div>
    </div>
  );
}
