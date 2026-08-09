import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { FRAME_STYLES, generateBuilderTitle, drawIDCard, drawPFPFrame } from '../utils/canvasUtils';

const STACKS = [
  'Full-Stack Dev', 'Frontend Engineer', 'Backend Engineer', 'Web3 / Solidity',
  'AI / ML Engineer', 'Mobile Dev', 'DevOps / Infra', 'Product Manager',
  'Designer / UI-UX', 'Data Engineer', 'Security Researcher', 'Solo Founder',
];

export default function Step4Style({ format, selected, onSelect, userData, imageSrc, cropData, onUserDataChange, onNext, onBack }) {
  const autoTitle = generateBuilderTitle(userData.name || 'Builder', userData.stack || '');

  const desktopCanvasRef = useRef(null); // portaled to left page on desktop
  const mobileCanvasRef = useRef(null);  // inline preview on mobile
  const [leftPageNode, setLeftPageNode] = useState(null);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => {
      setLeftPageNode(document.getElementById('left-page-2'));
    }, 100);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (!imageSrc) return;
    setGenerating(true);
    const drawToCanvas = async (canvas) => {
      if (!canvas) return;
      if (format === 'id') {
        await drawIDCard(canvas, imageSrc, userData, selected, cropData?.crop, null);
      } else {
        await drawPFPFrame(canvas, imageSrc, selected, cropData?.crop, cropData?.shape || 'circle');
      }
    };
    const run = async () => {
      await Promise.all([
        drawToCanvas(desktopCanvasRef.current),
        drawToCanvas(mobileCanvasRef.current),
      ]);
      setGenerating(false);
    };
    const t = setTimeout(run, 100);
    return () => clearTimeout(t);
  }, [format, imageSrc, userData, selected, cropData, leftPageNode]);

  return (
    <div className="hhg-panel">
      <div className="hhg-step-head">
        <h2>Choose Frame Style</h2>
        <p>{format === 'id' ? 'Pick a theme + fill in your builder details.' : 'Pick a colour theme for your frame.'}</p>
      </div>

      {/* Live Preview (Portaled to Left Page) */}
      {leftPageNode && createPortal(
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%', padding: '20px' }}>
          <div className="preview-wrap" style={{ width: '90%', maxWidth: '420px', position: 'relative' }}>
            <div className="preview-lbl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)', marginBottom: '10px' }}>Live Preview</div>
            <div className="preview-frame emerge-animation" style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 20px 40px rgba(0,0,0,0.3)' }}>
              <canvas
                ref={desktopCanvasRef}
                style={{
                  display: 'block',
                  width: '100%',
                  height: 'auto',
                  maxHeight: '65vh'
                }}
              />
              {generating && (
                <div className="preview-overlay" style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 'bold' }}>
                  Updating...
                </div>
              )}
            </div>
          </div>
        </div>,
        leftPageNode
      )}

      {/* Frame style grid */}
      <div className="frames-grid">
        {Object.entries(FRAME_STYLES).map(([key, fs]) => (
          <div
            key={key}
            className={`frame-opt ${selected === key ? 'sel' : ''}`}
            onClick={() => onSelect(key)}
          >
            <div
              className="frame-thumb"
              style={{
                background: `linear-gradient(135deg, ${fs.bg}, ${fs.borderColor}22)`,
                border: `2px solid ${fs.borderColor}44`,
              }}
            >
              <span>{fs.emoji}</span>
            </div>
            <div className="frame-name">{fs.name}</div>
          </div>
        ))}
      </div>

      {/* ── Mobile-only inline live preview ── */}
      <div className="hhg-mobile-only" style={{ margin: '18px auto 0', maxWidth: 320, width: '100%' }}>
        <div style={{
          textAlign: 'center',
          fontFamily: "'Space Mono', monospace",
          fontSize: 10,
          letterSpacing: '0.15em',
          color: 'rgba(255,255,255,0.5)',
          textTransform: 'uppercase',
          marginBottom: 10,
        }}>
          ◈ Live Preview
        </div>
        <div style={{ position: 'relative', borderRadius: 16, overflow: 'hidden', boxShadow: '0 0 0 2px rgba(232,200,64,0.4), 0 16px 40px rgba(0,0,0,0.4)' }}>
          <canvas
            ref={mobileCanvasRef}
            style={{ display: 'block', width: '100%', height: 'auto' }}
          />
          {generating && (
            <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#E8C840', fontFamily: "'Space Mono', monospace", fontSize: 11, fontWeight: 700, letterSpacing: '0.1em' }}>
              RENDERING…
            </div>
          )}
        </div>
      </div>

      {/* ID card fields */}
      {format === 'id' && (
        <div className="glass-card" style={{ maxWidth: 500, margin: '0 auto 20px' }}>
          <div style={{
            fontFamily: "'Unbounded', sans-serif", fontSize: 11, color: '#E8C840',
            letterSpacing: 1.5, textTransform: 'uppercase', marginBottom: 18,
            paddingBottom: 10, borderBottom: '1px solid rgba(232,200,64,0.15)',
          }}>
            Builder Details
          </div>

          <div className="fields-wrap">
            <div className="field-g">
              <label className="field-lbl">Your Name *</label>
              <input className="field-in" type="text" placeholder="Enter your Name" maxLength={32}
                value={userData.name} onChange={e => onUserDataChange({ ...userData, name: e.target.value })} />
            </div>
            <div className="field-g">
              <label className="field-lbl">Stack / Role *</label>
              <select className="field-sel" value={userData.stack}
                onChange={e => onUserDataChange({ ...userData, stack: e.target.value })}>
                <option value="" disabled>Select your role…</option>
                {STACKS.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="field-g">
              <label className="field-lbl">X / Twitter Handle</label>
              <input className="field-in" type="text" placeholder="@yourhandle" maxLength={20}
                value={userData.handle} onChange={e => onUserDataChange({ ...userData, handle: e.target.value })} />
            </div>
            <div className="field-g">
              <label className="field-lbl">Team Name (optional)</label>
              <input className="field-in" type="text" placeholder="Enter your team name" maxLength={28}
                value={userData.team} onChange={e => onUserDataChange({ ...userData, team: e.target.value })} />
            </div>
          </div>
        </div>
      )}

      <div className="nav-btns">
        <button className="btn btn-ghost" onClick={onBack}>← Back</button>
        <button
          className="btn btn-yellow btn-lg"
          disabled={!selected || (format === 'id' && !userData.name)}
          onClick={onNext}
        >
          Continue →
        </button>
      </div>
    </div>
  );
}
