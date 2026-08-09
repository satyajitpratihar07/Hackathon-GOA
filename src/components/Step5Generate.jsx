import { useEffect, useRef, useState, useCallback } from 'react';
import { createPortal } from 'react-dom';
import {
  drawPFPFrame, drawIDCard, downloadCanvas,
  canvasToPNGBlob, generateBuilderTitle, generateBadgeId, FRAME_STYLES,
} from '../utils/canvasUtils';

const CONF_COLORS = ['#E8C840','#FF1B8D','#00FF88','#ffffff','#FF6BB5','#00BFFF'];

// Helper to convert cropped photo into a tiny, highly compressed base64 JPEG
async function getTinyPhotoThumbnail(src, cropData) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = 40;
        canvas.height = 40;
        const ctx = canvas.getContext('2d');

        if (cropData?.crop) {
          const { x, y, width, height } = cropData.crop;
          const sx = (x / 100) * img.naturalWidth;
          const sy = (y / 100) * img.naturalHeight;
          const sw = (width / 100) * img.naturalWidth;
          const sh = (height / 100) * img.naturalHeight;
          ctx.drawImage(img, sx, sy, sw, sh, 0, 0, 40, 40);
        } else {
          const min = Math.min(img.naturalWidth, img.naturalHeight);
          const sx = (img.naturalWidth - min) / 2;
          const sy = (img.naturalHeight - min) / 2;
          ctx.drawImage(img, sx, sy, min, min, 0, 0, 40, 40);
        }

        const dataUrl = canvas.toDataURL('image/jpeg', 0.15); // 15% quality jpeg is tiny
        const base64 = dataUrl.split(',')[1];
        resolve(base64);
      } catch (e) {
        resolve('');
      }
    };
    img.onerror = () => resolve('');
    img.src = src;
  });
}

function createPortraitLanyardTexture(landscapeImgSrc) {
  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const W = 1080;
      const H = 1480;
      canvas.width = W;
      canvas.height = H;
      const ctx = canvas.getContext('2d');

      // Draw dark green backing card matching HH Goa event aesthetic
      ctx.fillStyle = '#0D3B1E';
      ctx.fillRect(0, 0, W, H);
      
      // Draw subtle grid in background
      ctx.strokeStyle = 'rgba(232, 200, 64, 0.08)';
      ctx.lineWidth = 1.5;
      const step = 40;
      for (let x = 0; x < W; x += step) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke();
      }
      for (let y = 0; y < H; y += step) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke();
      }

      // Rotate and draw landscape card sideways to perfectly fill the portrait lanyard mesh
      ctx.save();
      // Move origin to center of portrait canvas
      ctx.translate(W / 2, H / 2);
      // Rotate 90 degrees counter-clockwise
      ctx.rotate(-Math.PI / 2);
      
      // Since canvas is rotated, the axes are swapped.
      // We want to fill the portrait canvas (1080x1480).
      // So the rotated image needs to cover 1480 width and 1080 height.
      // Landscape image is 1080x680 (aspect ratio 1.58).
      // If we draw it at 1480 wide, its height would be 1480 / 1.58 = 936.
      // Let's just scale it slightly up to fit the 1080 bounds, or just center it.
      const cardW = 1420; 
      const cardH = 898; 
      
      ctx.shadowColor = 'rgba(0,0,0,0.8)';
      ctx.shadowBlur = 40;
      ctx.shadowOffsetY = 20;
      // Draw centered in the rotated context
      ctx.drawImage(img, -cardW / 2, -cardH / 2 + 50, cardW, cardH);
      ctx.restore();

      // Draw a vector clip loop hole at the top center of the portrait canvas
      ctx.fillStyle = '#E8C840';
      ctx.beginPath();
      ctx.arc(W / 2, 60, 16, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#0D3B1E';
      ctx.beginPath();
      ctx.arc(W / 2, 60, 8, 0, Math.PI * 2);
      ctx.fill();

      resolve(canvas.toDataURL('image/png'));
    };
    img.src = landscapeImgSrc;
  });
}

function Confetti({ active }) {
  if (!active) return null;
  return (
    <div className="confetti-layer">
      {Array.from({ length: 55 }, (_, i) => (
        <div key={i} className="conf-piece" style={{
          left: `${Math.random() * 100}%`,
          animationDelay: `${Math.random() * 1.5}s`,
          animationDuration: `${2.5 + Math.random() * 1.5}s`,
          background: CONF_COLORS[Math.floor(Math.random() * CONF_COLORS.length)],
          width: 6 + Math.random() * 8, height: 6 + Math.random() * 8,
        }} />
      ))}
    </div>
  );
}

export default function Step5Generate({ format, frameStyle, cropData, imageSrc, userData, onReset, onBack, inBook }) {
  const canvasRef = useRef(null);
  const [generating, setGenerating] = useState(true);
  const [done, setDone] = useState(false);
  const [confetti, setConfetti] = useState(false);
  const [toast, setToast] = useState('');
  const [toastOn, setToastOn] = useState(false);
  const [copied, setCopied] = useState(false);
  const [lanyardImageSrc, setLanyardImageSrc] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const showToast = useCallback((msg) => {
    setToast(msg); setToastOn(true);
    setTimeout(() => setToastOn(false), 5000);
  }, []);

  const generate = useCallback(async () => {
    if (!canvasRef.current || !imageSrc) return;
    setGenerating(true); setDone(false);
    try {
      if (format === 'pfp') {
        await drawPFPFrame(canvasRef.current, imageSrc, frameStyle, cropData?.crop, cropData?.shape || 'circle');
      } else {
        const bt = generateBuilderTitle(userData?.name || 'Builder', userData?.stack || '');
        const bId = generateBadgeId(userData?.name || 'Builder', userData?.stack || '');
        
        // Use MECARD format. It is universally supported by all smartphone cameras natively,
        // works completely offline, and guarantees a popup unlike raw text (which some cameras ignore).
        let qrData = `MECARD:N:${userData?.name || 'Builder'};`;
        if (userData?.team) qrData += `ORG:${userData.team};`;
        qrData += `NOTE:Role: ${userData?.stack || 'Developer'}, ID: ${bId};`;
        qrData += `;`;
        
        await drawIDCard(canvasRef.current, imageSrc, { ...userData, builderTitle: bt }, frameStyle, cropData?.crop, qrData);
      }
      setGenerating(false); setDone(true);
      setConfetti(true); setTimeout(() => setConfetti(false), 4000);
      showToast('✦ Your badge is ready!');
      
      // Pass the generated canvas image directly to the 3D Lanyard
      if (format === 'id') {
        setLanyardImageSrc(canvasRef.current.toDataURL('image/png'));
      }
    } catch (err) {
      console.error(err);
      setGenerating(false);
      showToast('⚠ Error generating. Try again.');
    }
  }, [format, frameStyle, cropData, imageSrc, userData, showToast]);

  const [leftPageNode, setLeftPageNode] = useState(null);

  useEffect(() => {
    // Wait a tick for the DOM to be ready since pages are rendered sequentially
    const t = setTimeout(() => {
      setLeftPageNode(document.getElementById('left-page-3'));
      generate();
    }, 300);
    return () => clearTimeout(t);
  }, [generate]);

  const handleSave = () => {
    if (!canvasRef.current || !done) return;
    const name = (userData?.name || 'builder').replace(/\s+/g, '-').toLowerCase();
    downloadCanvas(canvasRef.current, `hhgoa-2026-${name}-${format}.png`);
    showToast('💾 Saved as PNG!');
  };

  const handleCopy = async () => {
    if (!canvasRef.current || !done) return;
    try {
      const blob = await canvasToPNGBlob(canvasRef.current);
      await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
      setCopied(true); setTimeout(() => setCopied(false), 2500);
      showToast('📋 Copied to clipboard!');
    } catch { handleSave(); }
  };

  const tweetURL = (text) => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank', 'noopener');
  };

  const handleAnnounce = () => {
    const n = userData?.name || 'a builder';
    const s = userData?.stack ? ` | ${userData.stack}` : '';
    const h = userData?.handle ? ` ${userData.handle}` : '';
    tweetURL(`🌴 I'm heading to Hacker House Goa 2026 as ${n}${s}${h}!\n\nJoin 500 elite builders in Goa 🔥\n\n#FrameInGoa #HackerHouseGoa #HHGoa2026\n\nhhgoa.com`);
    showToast('🐦 Opening X to post!');
  };

  const handleShare = () => {
    tweetURL(`🌴 Just generated my #FrameInGoa builder badge for Hacker House Goa 2026!\n\nMake yours → hhgoa.com\n\n#HackerHouseGoa #HHGoa2026 @247pmstudio`);
    showToast('🐦 Sharing on X!');
  };

  const sf = FRAME_STYLES[frameStyle] || FRAME_STYLES.classic;

  const actionsContent = (
    <div className="actions-wrap" style={{ width: '100%' }}>
      <div className="actions-title" style={{ marginTop: '5px' }}>Actions</div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
        <button className="act-btn xblue" onClick={handleAnnounce} disabled={!done} style={{ padding: '8px 12px' }}>
          <div className="act-icon">𝕏</div>
          <div><span className="act-main" style={{ fontSize: '12px' }}>Announce</span></div>
        </button>
        <button className="act-btn sharebtn" onClick={handleShare} disabled={!done} style={{ padding: '8px 12px' }}>
          <div className="act-icon">🔗</div>
          <div><span className="act-main" style={{ fontSize: '12px' }}>Share</span></div>
        </button>
        <button className="act-btn copybtn" onClick={handleCopy} disabled={!done} style={{ padding: '8px 12px' }}>
          <div className="act-icon">{copied ? '✓' : '📋'}</div>
          <div><span className="act-main" style={{ fontSize: '12px' }}>{copied ? 'Copied!' : 'Copy'}</span></div>
        </button>
        <button className="act-btn viewbtn" onClick={() => setIsModalOpen(true)} disabled={!done} style={{ padding: '8px 12px' }}>
          <div className="act-icon">🔍</div>
          <div><span className="act-main" style={{ fontSize: '12px' }}>View Size</span></div>
        </button>
        <button className="act-btn savebtn" onClick={handleSave} disabled={!done} style={{ padding: '8px 12px', gridColumn: '1 / -1' }}>
          <div className="act-icon">💾</div>
          <div><span className="act-main" style={{ fontSize: '13px' }}>Download High-Res PNG</span></div>
        </button>
      </div>
    </div>
  );

  return (
    <div className="hhg-panel">
      <Confetti active={confetti} />

      <div className="hhg-step-head">
        <h2>Your Badge is Ready! ✦</h2>
        <p>Download, copy, or share directly to X with <span style={{ color: '#FF1B8D' }}>#FrameInGoa</span></p>
      </div>

      <div className="gen-layout" style={{ display: 'flex', justifyContent: 'center' }}>


        {/* Previews */}
        <div style={{ display: 'flex', gap: '20px', flex: 1, minWidth: 0, justifyContent: 'center' }}>
          
          {/* Left Page (Portaled) - Live Preview + Actions */}
          {leftPageNode && createPortal(
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'flex-start', width: '100%', height: '100%', padding: '20px', gap: '15px', overflowY: 'auto' }}>
              <div className="preview-wrap" style={{ width: '80%', maxWidth: '380px' }}>
                <div className="preview-lbl" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)' }}>Live Preview</div>
                <div className={`preview-frame ${done && inBook ? 'emerge-animation' : ''}`} style={{ position: 'relative' }}>
                  <canvas 
                    ref={canvasRef} 
                    style={{ 
                      display: 'block', 
                      width: '100%', 
                      height: 'auto', 
                      maxHeight: '38vh',
                      boxShadow: '0 20px 40px rgba(0,0,0,0.3)'
                    }} 
                  />
                  {generating && (
                    <div className="preview-overlay">
                      <div className="spinner" />
                      <div className="spin-lbl">Generating your badge…</div>
                    </div>
                  )}
                </div>
                {done && (
                  <div className="preview-meta" style={{ textShadow: '0 2px 10px rgba(0,0,0,0.5)', color: '#fff' }}>
                    {format === 'pfp' ? '1080×1080' : '1080×680'} px · PNG · #FrameInGoa
                  </div>
                )}
              </div>

              {/* Actions (Moved under the Preview on the Left Page) */}
              <div className="desktop-actions" style={{ width: '80%', maxWidth: '380px' }}>
                {actionsContent}
              </div>
            </div>,
            leftPageNode
          )}

          {/* Generated Badge Preview (Stays on Right Page, replaces 3D lanyard) */}
          {format === 'id' && done && lanyardImageSrc && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', alignItems: 'center', width: '100%', maxWidth: '380px' }}>
              <div className="preview-wrap mobile-2d-preview" style={{ width: '100%' }}>
                <div className="preview-lbl">Your Generated Badge</div>
                <div className={`preview-frame ${done && inBook ? 'emerge-animation' : ''}`} style={{ position: 'relative', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
                  <img src={lanyardImageSrc} alt="Badge Preview" style={{ width: '100%', height: 'auto', display: 'block' }} />
                </div>
              </div>

              {/* Navigation Actions (Moved to Right Page so they aren't hidden by overflow) */}
              <div style={{ display: 'flex', gap: '10px', width: '100%' }}>
                <button className="act-btn cancelbtn btn-ghost" style={{ flex: 1, padding: '10px' }} onClick={onBack}>
                  <div className="act-icon">←</div>
                  <div>
                    <span className="act-main" style={{ fontSize: '13px' }}>Back</span>
                  </div>
                </button>
                <button className="act-btn cancelbtn" style={{ flex: 1, padding: '10px' }} onClick={onReset}>
                  <div className="act-icon">↩</div>
                  <div>
                    <span className="act-main" style={{ fontSize: '13px' }}>Reset</span>
                  </div>
                </button>
              </div>

              {/* Mobile Actions Panel (Hidden on Desktop) */}
              <div className="mobile-actions" style={{ width: '100%', marginTop: '20px' }}>
                {actionsContent}
              </div>
            </div>
          )}

        </div>
      </div>
      {/* Full Size Image Modal via Portal */}
      {isModalOpen && typeof document !== 'undefined' && createPortal(
        <div 
          style={{ position: 'fixed', inset: 0, zIndex: 9999, background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px', backdropFilter: 'blur(8px)', cursor: 'zoom-out' }} 
          onClick={() => setIsModalOpen(false)}
        >
          <img 
            src={lanyardImageSrc} 
            alt="Full Size Badge" 
            style={{ maxWidth: '100%', maxHeight: '90vh', borderRadius: '16px', boxShadow: '0 20px 60px rgba(0,0,0,0.6)' }} 
            onClick={(e) => e.stopPropagation()} 
          />
          <button 
            style={{ position: 'absolute', top: '20px', right: '30px', background: 'transparent', border: 'none', color: '#fff', fontSize: '48px', cursor: 'pointer', opacity: 0.7 }}
            onClick={() => setIsModalOpen(false)}
          >
            ×
          </button>
        </div>,
        document.body
      )}

      {/* Toast via Portal to avoid stacking context issues */}
      {typeof document !== 'undefined' && createPortal(
        <div className={`toast ${toastOn ? 'show' : ''}`}>{toast}</div>,
        document.body
      )}
    </div>
  );
}
