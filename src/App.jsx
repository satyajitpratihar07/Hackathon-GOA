import React, { useState, useRef, useCallback, useEffect } from 'react';
import Step2Adjust from './components/Step2Adjust';
import Step3Choose from './components/Step3Choose';
import Step4Style from './components/Step4Style';
import Step5Generate from './components/Step5Generate';
import HHGoaBackground from './components/HHGoaBackground';
import InteractiveBook from './components/InteractiveBook';
import IntroScreen from './components/IntroScreen';
import HackerHome from './components/HackerHome';
import ErrorTerminal from './components/ErrorTerminal';
import EchoText from './components/EchoText';
import { motion, AnimatePresence } from 'framer-motion';
import './index.css';

// ── SW for offline (Disable in development to prevent aggressive caching) ──
if ('serviceWorker' in navigator) {
  if (import.meta.env.DEV) {
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (const registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('Cleared service worker cache for hot reload.');
            window.location.reload();
          }
        });
      }
    });
  } else {
    window.addEventListener('load', () =>
      navigator.serviceWorker.register('/sw.js').catch(() => { })
    );
  }
}

// ── Read any image file into a data URL ──
function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = e => resolve(e.target.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─────────────────────────────────────────────
// STEP 1 – UPLOAD COMPONENT
// ─────────────────────────────────────────────
const SAMPLE_AVATARS = [
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="bg1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%23ff007f"/><stop offset="100%" stop-color="%23ffaa00"/></linearGradient></defs><rect width="100" height="100" rx="20" fill="url(%23bg1)"/><circle cx="50" cy="50" r="30" fill="%230d3b1e"/><path d="M35 50 Q35 70 50 70 Q65 70 65 50 Z" fill="%23ffd59a"/><path d="M32 46 Q50 30 68 46" stroke="%23ff1b8d" stroke-width="8" fill="none"/><path d="M50 38 L80 34" stroke="%23ff1b8d" stroke-width="6" stroke-linecap="round"/><rect x="34" y="44" width="32" height="10" rx="3" fill="%2300ff88" opacity="0.9"/><path d="M35 70 Q50 82 65 70" stroke="%2300ff88" stroke-width="4" fill="none"/></svg>`,
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="bg2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%237b2cbf"/><stop offset="100%" stop-color="%23e0aaff"/></linearGradient></defs><rect width="100" height="100" rx="20" fill="url(%23bg2)"/><circle cx="50" cy="50" r="30" fill="%230d3b1e"/><path d="M35 50 Q35 70 50 70 Q65 70 65 50 Z" fill="%23ffdbac"/><path d="M32 45 Q50 25 68 45" stroke="%23e8c840" stroke-width="10" fill="none"/><circle cx="32" cy="50" r="8" fill="%23ff1b8d"/><circle cx="68" cy="50" r="8" fill="%23ff1b8d"/><path d="M32 42 Q50 20 68 42" stroke="%23ff1b8d" stroke-width="4" fill="none"/><circle cx="43" cy="48" r="6" fill="%230a0a0a"/><circle cx="57" cy="48" r="6" fill="%230a0a0a"/><line x1="49" y1="48" x2="51" y2="48" stroke="%230a0a0a" stroke-width="2"/></svg>`,
  `data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" width="100" height="100"><defs><linearGradient id="bg3" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="%231a5c2e"/><stop offset="100%" stop-color="%2300ff88"/></linearGradient></defs><rect width="100" height="100" rx="20" fill="url(%23bg3)"/><circle cx="50" cy="50" r="30" fill="%230d3b1e"/><path d="M35 50 Q35 70 50 70 Q65 70 65 50 Z" fill="%23ffd59a"/><path d="M32 45 Q50 30 68 45" stroke="%23e8c840" stroke-width="8" fill="none"/><path d="M30 45 L15 50" stroke="%23e8c840" stroke-width="6" stroke-linecap="round"/><rect x="36" y="44" width="11" height="8" rx="2" fill="none" stroke="%23ffd700" stroke-width="2"/><rect x="53" y="44" width="11" height="8" rx="2" fill="none" stroke="%23ffd700" stroke-width="2"/><line x1="47" y1="48" x2="53" y2="48" stroke="%23ffd700" stroke-width="2"/></svg>`
];

function Step1Upload({ onNext, imageSrc, onReset }) {
  const [drag, setDrag] = useState(false);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);

  const handle = useCallback(async (file) => {
    if (!file) return;
    const ok = file.type.startsWith('image/') ||
      /\.(heic|heif|jpg|jpeg|png|gif|webp|bmp|tiff)$/i.test(file.name);
    if (!ok) { alert('Please upload an image (JPG, PNG, HEIC, etc.)'); return; }
    setLoading(true);
    try {
      const src = await readFileAsDataURL(file);
      onNext(src);
    } catch { alert('Could not load image. Try another file.'); }
    finally { setLoading(false); }
  }, [onNext]);

  return (
    <div className="hhg-step-card-modern">
      <div className="hhg-step-header-compact">
        <div className="hhg-step-counter-modern">STEP 01 OF 05</div>
        <div className="hhg-free-badge-modern">FREE FOREVER</div>
        {imageSrc && <span className="hhg-status-check-modern">✓</span>}
      </div>

      <div className="hhg-step-title-block">
        <h2>UPLOAD YOUR PHOTO</h2>
        <p>Works with any photo — no pre-cropping needed.</p>
      </div>

      {!imageSrc ? (
        <label
          className={`hhg-upload-zone-modern ${drag ? 'drag' : ''}`}
          onDragOver={e => { e.preventDefault(); setDrag(true); }}
          onDragLeave={() => setDrag(false)}
          onDrop={e => { e.preventDefault(); setDrag(false); handle(e.dataTransfer.files[0]); }}
          htmlFor="hhg-file"
        >
          {loading ? (
            <div className="hhg-upload-loading-modern">
              <div className="spinner-modern" />
              <div>
                <h3>Processing photo…</h3>
                <p>Please wait a moment</p>
              </div>
            </div>
          ) : (
            <div className="hhg-upload-center-content-modern">
              <div className="hhg-upload-icon-modern">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="17 8 12 3 7 8"></polyline><line x1="12" y1="3" x2="12" y2="15"></line></svg>
              </div>
              <h3>DRAG & DROP PHOTO</h3>
              <p>JPG, PNG, WEBP, HEIC (Max 20MB)</p>

              <div className="hhg-upload-btn-row-modern">
                <button
                  className="btn-modern btn-browse"
                  type="button"
                  onClick={e => { e.preventDefault(); inputRef.current?.click(); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg> Browse Files
                </button>
                <button
                  className="btn-modern btn-camera"
                  type="button"
                  onClick={e => { e.preventDefault(); inputRef.current?.click(); }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg> Take Photo
                </button>
              </div>
            </div>
          )}
          <input
            id="hhg-file" ref={inputRef} type="file"
            accept="image/*,.heic,.heif"
            className="hhg-upload-input"
            onChange={e => handle(e.target.files[0])}
          />
        </label>
      ) : (
        <div className="hhg-upload-done-preview-modern">
          <div className="hhg-preview-thumbnail-modern">
            <img src={imageSrc} alt="Uploaded source" />
          </div>
          <div className="hhg-preview-actions-modern">
            <p>Photo loaded successfully.</p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
              <button className="btn-modern btn-ghost" onClick={onReset}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 4 23 10 17 10"></polyline><polyline points="1 20 1 14 7 14"></polyline><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path></svg> Change
              </button>
              <button className="btn-modern" style={{ background: '#E8C840', color: '#0F172A', border: '1px solid #E8C840' }} onClick={() => onNext(imageSrc)}>
                Continue →
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────
// MAIN APP (VERTICAL SCROLLABLE PROCESS FLOW)
// ─────────────────────────────────────────────
export default function App() {
  const [step, setStep] = useState(0);
  const titleContainerRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(null);
  const [cropData, setCropData] = useState(null);
  const [format, setFormat] = useState(null);
  const [frameStyle, setFrameStyle] = useState('classic');
  const [userData, setUserData] = useState({ name: '', stack: '', handle: '', team: '' });
  const [verifyData, setVerifyData] = useState(null);
  const [introDone, setIntroDone] = useState(false);
  const [isHouseOpen, setIsHouseOpen] = useState(false);
  const [isErrorTerminalOpen, setIsErrorTerminalOpen] = useState(false);
  const [bookVisible, setBookVisible] = useState(false);
  const [bgShift, setBgShift] = useState('center');
  const [touchStartX, setTouchStartX] = useState(null);
  const [touchStartBgShift, setTouchStartBgShift] = useState('center');
  const [dragOffset, setDragOffset] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [showInstructionBoard, setShowInstructionBoard] = useState(true);
  const bookRef = useRef(null);

  useEffect(() => {
    // Preload book cover and theme backgrounds to ensure zero transition lag/flicker
    const imagesToPreload = [
      '/hacker_house_cover.png',
      '/neon_id_bg.png',
      '/sunset_id_bg.png',
      '/hacker_id_bg.png',
      '/vintage_id_bg.png'
    ];
    imagesToPreload.forEach(src => {
      const img = new Image();
      img.src = src;
    });

    const timer = setTimeout(() => {
      setShowInstructionBoard(false);
    }, 10000); // Disappears after 10 seconds!
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('verify') === 'true') {
      setVerifyData({
        name: params.get('n') || 'Builder',
        title: params.get('t') || 'Verified Hacker',
        stack: params.get('s') || 'Developer',
        id: params.get('id') || 'HHG26-0000',
        photo: params.get('p') ? `data:image/jpeg;base64,${params.get('p')}` : null,
      });
    }
  }, []);

  // Refs for scrolling to new section
  const step2Ref = useRef(null);
  const step3Ref = useRef(null);
  const step4Ref = useRef(null);
  const step5Ref = useRef(null);

  const scrollToRef = (ref) => {
    setTimeout(() => {
      ref.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const handleTouchStart = (e) => {
    if (bookVisible || isHouseOpen || isErrorTerminalOpen) return;
    setTouchStartX(e.touches[0].clientX);
    setTouchStartBgShift(bgShift);
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (touchStartX === null) return;
    const dx = e.touches[0].clientX - touchStartX;

    // Calculate max translation dynamically based on physical screen crop
    const H = window.innerHeight;
    const W = window.innerWidth;
    const Sw = H * 1.6;
    const maxDrag = Math.max(0, (Sw - W) / 2);

    let baseTranslate = 0;
    if (touchStartBgShift === 'left') baseTranslate = maxDrag;
    else if (touchStartBgShift === 'right') baseTranslate = -maxDrag;

    const minOffset = -maxDrag - baseTranslate;
    const maxOffset = maxDrag - baseTranslate;

    const clamped = Math.max(minOffset, Math.min(maxOffset, dx));
    setDragOffset(clamped);
  };

  const handleTouchEnd = () => {
    if (touchStartX === null) return;
    setIsDragging(false);

    const threshold = 60; // 60px swipe threshold to trigger snap

    if (dragOffset > threshold) {
      // Dragged right -> show left house (or center)
      if (touchStartBgShift === 'center') {
        setBgShift('left');
      } else if (touchStartBgShift === 'right') {
        setBgShift('center');
      } else {
        setBgShift('left');
      }
    } else if (dragOffset < -threshold) {
      // Dragged left -> show right house (or center)
      if (touchStartBgShift === 'center') {
        setBgShift('right');
      } else if (touchStartBgShift === 'left') {
        setBgShift('center');
      } else {
        setBgShift('right');
      }
    } else {
      // Return to starting state
      setBgShift(touchStartBgShift);
    }
    setTouchStartX(null);
    setDragOffset(0);
  };

  const reset = () => {
    setStep(0);
    setImageSrc(null);
    setCropData(null);
    setFormat(null);
    setFrameStyle('classic');
    setUserData({ name: '', stack: '', handle: '', team: '' });
  };

  if (verifyData) {
    return (
      <div className="hhg-verify-wrap">
        <div className="hhg-bg">
          <div className="hhg-bg-gradient" />
          <div className="hhg-bg-grid" />
          <HHGoaBackground />
        </div>
        <div className="hhg-verify-container">
          <div className="hhg-verify-badge-card">
            {/* Candy candy stripes border top */}
            <div className="hhg-badge-top-strip" />

            <div className="hhg-verify-badge-header">
              <div className="verify-shield">🛡️</div>
              <div>
                <h2>VERIFIED BUILDER PASS</h2>
                <p>HACKER HOUSE GOA 2026</p>
              </div>
            </div>

            <div className="hhg-verify-photo-wrap">
              {verifyData.photo ? (
                <img src={verifyData.photo} className="hhg-verify-photo" alt="Hacker" />
              ) : (
                <div className="hhg-verify-photo-placeholder">👤</div>
              )}
              <div className="hhg-verify-check-pill">✓ VERIFIED</div>
            </div>

            <div className="hhg-verify-info">
              <span className="info-lbl">BUILDER NAME</span>
              <h3 className="info-val name">{verifyData.name.toUpperCase()}</h3>

              <span className="info-lbl">ROLE / STACK</span>
              <h4 className="info-val">{verifyData.stack.toUpperCase()}</h4>

              <span className="info-lbl">CLASS / TITLE</span>
              <h4 className="info-val title">{verifyData.title.toUpperCase()}</h4>

              <div className="hhg-verify-meta">
                <div>
                  <span className="info-lbl">PASS CODE</span>
                  <p className="code-id">#{verifyData.id}</p>
                </div>
                <div>
                  <span className="info-lbl">ACCESS GRADE</span>
                  <p className="access-status">100% BUILDER</p>
                </div>
              </div>
            </div>

            <div className="hhg-verify-footer">
              <div className="barcode-mock" />
              <p>GOA, INDIA · 28-31 OCT 2026</p>
            </div>
          </div>

          <button
            className="btn btn-yellow btn-lg"
            onClick={() => window.location.href = window.location.origin}
            style={{ marginTop: '24px', boxShadow: '0 8px 32px rgba(232, 200, 64, 0.25)' }}
          >
            🌴 Create Your Own Badge
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Particle intro splash — unmounts automatically after animation */}
      {!verifyData && <IntroScreen onDone={() => setIntroDone(true)} />}

      {/* Hacker Home Dashboard Overlay (Left House) */}
      {isHouseOpen && <HackerHome onClose={() => { setIsHouseOpen(false); setBgShift('center'); }} />}

      {/* Error Terminal Dashboard Overlay (Right House) */}
      {isErrorTerminalOpen && <ErrorTerminal onClose={() => { setIsErrorTerminalOpen(false); setBgShift('center'); }} />}

      {/* Interactive Book Flow — cinematic modal overlay with Framer Motion (Moved to root level for reliable click capture) */}
      <AnimatePresence>
        {bookVisible && (
          <motion.div
            ref={bookRef}
            className="hhg-book-backdrop-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            style={{
              position: 'fixed',
              top: 0,
              left: 0,
              width: '100vw',
              height: '100vh',
              zIndex: 9990,
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              overflow: 'hidden',
              backgroundColor: 'rgba(5, 20, 10, 0.82)',
              backdropFilter: 'blur(12px)',
              isolation: 'isolate',
              WebkitTransform: 'translateZ(0)' // Force GPU acceleration and fix 3D intersection
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                willChange: 'transform, opacity', // Hint browser for premium 60fps performance
              }}
            >
              <InteractiveBook step={step} onOpen={() => setStep(1)} onClose={() => { setStep(0); setBookVisible(false); }}>
                {/* Page 1: UPLOAD */}
                <Step1Upload
                  imageSrc={imageSrc}
                  onNext={(src) => {
                    setImageSrc(src);
                    setStep(2);
                  }}
                  onReset={reset}
                />

                {/* Page 2: ADJUST */}
                {imageSrc ? (
                  <Step2Adjust
                    imageSrc={imageSrc}
                    onNext={(data) => {
                      setCropData(data);
                      setStep(3);
                    }}
                    onBack={() => setStep(1)}
                  />
                ) : (
                  <div style={{ padding: '20px' }}>Please upload an image first.</div>
                )}

                {/* Page 3: CHOOSE FORMAT */}
                <Step3Choose
                  selected={format}
                  onSelect={(fmt) => {
                    setFormat(fmt);
                  }}
                  onNext={() => {
                    setStep(4);
                  }}
                  onBack={() => setStep(2)}
                />

                {/* Page 4: FRAME STYLE */}
                <Step4Style
                  format={format}
                  selected={frameStyle}
                  onSelect={setFrameStyle}
                  userData={userData}
                  imageSrc={imageSrc}
                  cropData={cropData}
                  onUserDataChange={setUserData}
                  onNext={() => {
                    setStep(5);
                  }}
                  onBack={() => setStep(3)}
                />

                {/* Page 5: GENERATE & SHARE */}
                {imageSrc ? (
                  <Step5Generate
                    format={format}
                    frameStyle={frameStyle}
                    cropData={cropData}
                    imageSrc={imageSrc}
                    userData={userData}
                    onReset={reset}
                    onBack={() => setStep(4)}
                    inBook={true}
                  />
                ) : (
                  <div style={{ padding: '20px' }}>Missing data.</div>
                )}
              </InteractiveBook>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Background */}
      <div
        className="hhg-bg"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        style={{ pointerEvents: bookVisible ? 'none' : 'auto', touchAction: 'pan-y' }}
      >
        <div className="hhg-bg-gradient" />
        <div className="hhg-bg-grid" />
        <HHGoaBackground
          bgShift={bgShift}
          dragOffset={dragOffset}
          isDragging={isDragging}
          onHouseClick={() => setIsHouseOpen(true)}
          onRightHouseClick={() => setIsErrorTerminalOpen(true)}
        />
        <div className="hhg-orb hhg-orb-1" />
        <div className="hhg-orb hhg-orb-2" />
      </div>

      <div className="hhg-app" style={{ pointerEvents: bookVisible ? 'none' : 'auto', display: 'flex', flexDirection: 'column' }}>
        {/* Header */}
        <header className="hhg-header">
          <a href="https://hhgoa.com" target="_blank" rel="noopener noreferrer" className="hhg-logo">
            <div className="hhg-logo-badge">HH</div>
            <div className="hhg-logo-text">
              <div className="hhg-logo-title">HACKER HOUSE</div>
              <div className="hhg-logo-sub">GOA 2026 · 28–31 OCT</div>
            </div>
          </a>
          <div className="hhg-hashtag">#FrameInGoa</div>
        </header>

        {/* Hero Section */}
        <div className="hhg-hero">
          <div ref={titleContainerRef} className="title-wrapper-tropical" style={{ position: 'relative', margin: '4vh auto 0', maxWidth: '900px', padding: '0 20px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <EchoText
              text="HACKER"
              echoes={8}
              lag={0.25}
              offset={40}
              direction="up"
              fade={0.65}
              blur={1}
              tint="#00FF88"
              mode="both"
              cursorRadius={400}
              duration={1000}
              ease="ease-out"
              fontSize="clamp(3rem, 15vw, 11rem)"
              fontWeight={900}
              color="#ffffff"
              className="hhg-hero-title-main"
              containerRef={titleContainerRef}
            />
            <EchoText
              text="HOUSE"
              echoes={8}
              lag={0.25}
              offset={40}
              direction="down"
              fade={0.65}
              blur={1}
              tint="#FF1B8D"
              mode="both"
              cursorRadius={400}
              duration={1000}
              ease="ease-out"
              fontSize="clamp(3rem, 15vw, 11rem)"
              fontWeight={900}
              color="#ffffff"
              className="hhg-hero-title-main"
              containerRef={titleContainerRef}
            />

            {/* Unified Hanging Wooden Signboard (Date Banner + Single Rope + 10s Animated Instruction Board) */}
            <div className="hhg-mobile-only hhg-wooden-signboard-container">
              <svg viewBox="0 0 540 210" className="hhg-wooden-signboard-svg">
                <defs>
                  <linearGradient id="boldRopeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#FFF0C2" />
                    <stop offset="30%" stopColor="#E5B566" />
                    <stop offset="70%" stopColor="#9C6B2E" />
                    <stop offset="100%" stopColor="#4A2F0F" />
                  </linearGradient>

                  <linearGradient id="woodPlankGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#4E311D" />
                    <stop offset="35%" stopColor="#361F11" />
                    <stop offset="70%" stopColor="#241209" />
                    <stop offset="100%" stopColor="#140803" />
                  </linearGradient>

                  <linearGradient id="woodBorderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#7C5435" />
                    <stop offset="50%" stopColor="#3D2414" />
                    <stop offset="100%" stopColor="#180A03" />
                  </linearGradient>

                  <linearGradient id="largeBoardWoodGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                    <stop offset="0%" stopColor="#5A3720" />
                    <stop offset="40%" stopColor="#3B2213" />
                    <stop offset="80%" stopColor="#241309" />
                    <stop offset="100%" stopColor="#160A04" />
                  </linearGradient>

                  <filter id="signboardShadow" x="-10%" y="-10%" width="130%" height="140%">
                    <feDropShadow dx="0" dy="8" stdDeviation="6" floodColor="#000" floodOpacity="0.85" />
                  </filter>
                </defs>

                {/* 1. UPPER DATE BANNER (28–31 OCT 2026, GOA INDIA) - Anchor Hanger */}
                <g transform="translate(30, 0)">
                  <g filter="url(#signboardShadow)">
                    {/* Outer Broken Border Plank */}
                    <path
                      d="M 12,25 L 35,15 L 42,22 L 70,12 L 95,20 L 120,10 L 130,18 L 140,8 L 175,18 L 205,10 L 240,22 L 270,10 L 300,18 L 330,10 L 360,20 L 390,12 L 415,22 L 440,10 L 468,25 L 458,40 L 476,52 L 462,65 L 478,78 L 464,95 L 448,112 L 418,102 L 392,118 L 362,108 L 332,116 L 298,106 L 268,118 L 242,108 L 212,116 L 172,106 L 148,116 L 118,108 L 88,118 L 58,106 L 38,116 L 18,106 L 5,112 L 15,92 L 2,78 L 17,62 L 4,48 Z"
                      fill="url(#woodBorderGrad)"
                    />

                    {/* Inner Wood Surface */}
                    <path
                      d="M 16,28 L 37,19 L 44,25 L 70,16 L 95,23 L 120,14 L 130,21 L 140,12 L 173,21 L 203,14 L 238,25 L 268,14 L 298,21 L 328,14 L 358,23 L 388,16 L 413,25 L 436,15 L 462,28 L 453,41 L 469,52 L 457,64 L 471,76 L 458,92 L 443,107 L 416,98 L 390,113 L 360,104 L 330,111 L 296,102 L 266,113 L 240,104 L 210,111 L 170,102 L 146,111 L 116,104 L 86,113 L 58,102 L 39,111 L 21,102 L 9,107 L 18,89 L 6,77 L 19,63 L 8,50 Z"
                      fill="url(#woodPlankGrad)"
                    />
                  </g>

                  {/* Vertical Wood Slats */}
                  <g stroke="rgba(0, 0, 0, 0.45)" strokeWidth="2.5">
                    <line x1="45" y1="20" x2="45" y2="105" />
                    <line x1="88" y1="18" x2="88" y2="108" />
                    <line x1="130" y1="18" x2="130" y2="107" />
                    <line x1="172" y1="20" x2="172" y2="104" />
                    <line x1="212" y1="18" x2="212" y2="107" />
                    <line x1="255" y1="20" x2="255" y2="108" />
                    <line x1="298" y1="18" x2="298" y2="106" />
                    <line x1="340" y1="20" x2="340" y2="108" />
                    <line x1="382" y1="18" x2="382" y2="107" />
                    <line x1="425" y1="20" x2="425" y2="105" />
                  </g>

                  {/* Wood Cracks & Highlights */}
                  <path d="M 140,12 L 145,45 L 141,60" stroke="#0E0603" strokeWidth="2.5" fill="none" />
                  <path d="M 330,111 L 327,85 L 332,68" stroke="#0E0603" strokeWidth="2.5" fill="none" />
                  <path d="M 35,38 Q 240,32 445,38" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" fill="none" />

                  {/* Left Motif Medallion */}
                  <g transform="translate(18, 36) scale(1.05)">
                    <circle cx="20" cy="24" r="18" fill="#241209" stroke="#5C3A21" strokeWidth="2" />
                    <text x="20" y="32" fontSize="22" textAnchor="middle">🌴</text>
                  </g>

                  {/* Date Text */}
                  <text x="250" y="52" fill="#EAEAEA" fontSize="32" fontWeight="900" fontFamily="'Trade Winds', 'New Rocker', 'Pirata One', cursive, sans-serif" letterSpacing="2px" textAnchor="middle" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 2px rgba(255,255,255,0.4))' }}>
                    28–31 OCT 2026
                  </text>
                  <text x="250" y="92" fill="#EAEAEA" fontSize="28" fontWeight="900" fontFamily="'Trade Winds', 'New Rocker', 'Pirata One', cursive, sans-serif" letterSpacing="3px" textAnchor="middle" style={{ filter: 'drop-shadow(0 4px 8px rgba(0,0,0,0.95)) drop-shadow(0 0 2px rgba(255,255,255,0.4))' }}>
                    GOA, INDIA
                  </text>

                  {/* Center Ring Eyelet Grommet on Bottom Edge of Date Banner for Ropes */}
                  {showInstructionBoard && (
                    <g>
                      <circle cx="240" cy="104" r="9" fill="#180A03" stroke="#D4A373" strokeWidth="3" />
                      <circle cx="240" cy="104" r="4.5" fill="#2E180E" />
                    </g>
                  )}
                </g>

                {/* 2. HIGHLY VISIBLE HANGING ROPES & ANIMATED INSTRUCTION BOARD */}
                <AnimatePresence>
                  {showInstructionBoard && (
                    <motion.g
                      key="hanging-instruction-board"
                      style={{ transformOrigin: '270px 104px' }}
                      initial={{ opacity: 0, y: -45, rotate: -16, scale: 0.85 }}
                      animate={{ opacity: 1, y: 0, rotate: [12, -8, 5, -2, 0], scale: 1 }}
                      exit={{ opacity: 0, y: -30, rotate: 14, scale: 0.85 }}
                      transition={{ duration: 1.2, ease: "easeOut" }}
                    >
                      {/* Left Angled Braided Rope (100% VISIBLE) */}
                      <path
                        d="M 270,104 L 100,140"
                        stroke="#140803"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 270,104 L 100,140"
                        stroke="url(#boldRopeGrad)"
                        strokeWidth="7.5"
                        strokeDasharray="7 2.5"
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.85))' }}
                      />

                      {/* Right Angled Braided Rope (100% VISIBLE) */}
                      <path
                        d="M 270,104 L 440,140"
                        stroke="#140803"
                        strokeWidth="10"
                        strokeLinecap="round"
                      />
                      <path
                        d="M 270,104 L 440,140"
                        stroke="url(#boldRopeGrad)"
                        strokeWidth="7.5"
                        strokeDasharray="7 2.5"
                        strokeLinecap="round"
                        style={{ filter: 'drop-shadow(2px 4px 6px rgba(0,0,0,0.85))' }}
                      />

                      {/* Instruction Board Panel (Shifted Upward to y = 140) */}
                      <g transform="translate(0, 140)">
                        {/* Outer Board with Drop Shadow */}
                        <g filter="url(#signboardShadow)">
                          <rect x="25" y="0" width="490" height="68" rx="12" fill="url(#largeBoardWoodGrad)" stroke="#6E492B" strokeWidth="3.5" />
                        </g>

                        {/* Left & Right Ring Eyelet Grommets on Instruction Board */}
                        <circle cx="100" cy="2" r="9" fill="#180A03" stroke="#D4A373" strokeWidth="3" />
                        <circle cx="100" cy="2" r="4.5" fill="#2E180E" />
                        <circle cx="440" cy="2" r="9" fill="#180A03" stroke="#D4A373" strokeWidth="3" />
                        <circle cx="440" cy="2" r="4.5" fill="#2E180E" />

                        {/* Vertical Wood Slats */}
                        <g stroke="rgba(0, 0, 0, 0.4)" strokeWidth="2.5">
                          <line x1="90" y1="2" x2="90" y2="66" />
                          <line x1="180" y1="2" x2="180" y2="66" />
                          <line x1="270" y1="2" x2="270" y2="66" />
                          <line x1="360" y1="2" x2="360" y2="66" />
                          <line x1="450" y1="2" x2="450" y2="66" />
                        </g>

                        {/* Wood Grain Highlights */}
                        <path d="M 35,18 Q 270,12 505,18" stroke="rgba(255, 255, 255, 0.08)" strokeWidth="1.5" fill="none" />
                        <path d="M 35,50 Q 270,56 505,50" stroke="rgba(0, 0, 0, 0.3)" strokeWidth="1.5" fill="none" />

                        {/* Content Written Inside Board */}
                        <text
                          x="270" y="44"
                          fill="#00FF88"
                          fontSize="21"
                          fontWeight="900"
                          fontFamily="'Trade Winds', 'New Rocker', 'Pirata One', cursive, sans-serif"
                          letterSpacing="2px"
                          textAnchor="middle"
                          style={{ filter: 'drop-shadow(0 3px 6px rgba(0,0,0,0.95)) drop-shadow(0 0 10px rgba(0,255,136,0.6))' }}
                        >
                          MOVE SCREEN & CLICK HOUSE 🏠 ↔
                        </text>
                      </g>
                    </motion.g>
                  )}
                </AnimatePresence>
              </svg>
            </div>
          </div>

          {/* Scroll Down Section: GET STARTED Button */}
          <div className="hhg-scroll-btn-wrap">
            <button
              className="hhg-scroll-btn"
              onClick={() => {
                setBookVisible(true);
              }}
              aria-label="Get Started"
              style={{ minWidth: '240px', height: '48px', justifyContent: 'center', whiteSpace: 'nowrap' }}
            >
              <svg className="btn-svg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
              <div className="txt-wrapper">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '2px', whiteSpace: 'nowrap' }}>
                  {'GET STARTED'.split('').map((char, index) => (
                    <span key={index} className="btn-letter" style={{ animationDelay: `${index * 0.08}s` }}>
                      {char === ' ' ? '\u00A0' : char}
                    </span>
                  ))}
                </div>
              </div>
            </button>
          </div>
        </div>

        {/* Modal flow moved to root level */}

        <footer className="hhg-footer">
          <span>#FrameInGoa</span> · HH Goa 2026 · GOA, INDIA · 28–31 OCT 2026 · <span>2:47 PM STUDIO</span>
        </footer>
      </div>
    </>
  );
}
