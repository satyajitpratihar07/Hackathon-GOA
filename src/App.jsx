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
  const bookRef = useRef(null);

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
      {isHouseOpen && <HackerHome onClose={() => setIsHouseOpen(false)} />}

      {/* Error Terminal Dashboard Overlay (Right House) */}
      {isErrorTerminalOpen && <ErrorTerminal onClose={() => setIsErrorTerminalOpen(false)} />}

      {/* Background */}
      <div className="hhg-bg">
        <div className="hhg-bg-gradient" />
        <div className="hhg-bg-grid" />
        <HHGoaBackground
          onHouseClick={() => setIsHouseOpen(true)}
          onRightHouseClick={() => setIsErrorTerminalOpen(true)}
        />
        <div className="hhg-orb hhg-orb-1" />
        <div className="hhg-orb hhg-orb-2" />
      </div>

      <div className="hhg-app">
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
            <div className="hhg-mobile-only" style={{
              marginTop: '1.5rem',
              color: '#000000',
              fontWeight: 900,
              fontSize: 'clamp(1rem, 4vw, 1.5rem)',
              letterSpacing: '0.5em',
              textTransform: 'uppercase',
              textShadow: '0 2px 10px rgba(255,255,255,0.5)',
              fontFamily: "'Unbounded', sans-serif",
              textAlign: 'center',
              backgroundColor: 'rgba(255,255,255,0.7)',
              padding: '8px 24px',
              borderRadius: '50px',
              backdropFilter: 'blur(10px)',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
            }}>
              28–31 OCT 2026 • GOA, INDIA
            </div>
          </div>          {/* Scroll Down Button */}
          <div className="hhg-scroll-btn-wrap">
            <button
              className="hhg-scroll-btn"
              onClick={() => {
                setBookVisible(true);
              }}
              aria-label="Scroll down to get started"
            >
              <span className="hhg-scroll-btn-text">GET STARTED</span>
              <span className="hhg-scroll-chevrons">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M4 6 L10 13 L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" style={{ marginTop: '-8px', opacity: 0.5 }}>
                  <path d="M4 6 L10 13 L16 6" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
          </div>
        </div>

        {/* Interactive Book Flow — cinematic modal overlay with Framer Motion */}
        <AnimatePresence>
          {bookVisible && (
            <motion.div
              ref={bookRef}
              className="hhg-book-backdrop-overlay"
              initial={{ opacity: 0, backgroundColor: 'rgba(5, 20, 10, 0)' }}
              animate={{ opacity: 1, backgroundColor: 'rgba(5, 20, 10, 0.82)' }}
              exit={{ opacity: 0, backgroundColor: 'rgba(5, 20, 10, 0)' }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
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
                perspective: '2000px',
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Blur backdrop animation */}
              <motion.div
                initial={{ backdropFilter: 'blur(0px)' }}
                animate={{ backdropFilter: 'blur(12px)' }}
                exit={{ backdropFilter: 'blur(0px)' }}
                transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
                style={{
                  position: 'absolute',
                  inset: 0,
                  pointerEvents: 'none',
                }}
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.68, rotateX: 15, rotateY: -15, y: 70 }}
                animate={{ opacity: 1, scale: 1, rotateX: 0, rotateY: 0, y: 0 }}
                exit={{ opacity: 0, scale: 0.78, rotateX: -12, rotateY: 12, y: 50 }}
                transition={{
                  type: 'spring',
                  damping: 25,
                  stiffness: 110,
                  mass: 1
                }}
                style={{
                  width: '100%',
                  height: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  transformStyle: 'preserve-3d',
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

        <footer className="hhg-footer">
          <span>#FrameInGoa</span> · HH Goa 2026 · GOA, INDIA · 28–31 OCT 2026 · <span>2:47 PM STUDIO</span>
        </footer>
      </div>
    </>
  );
}
