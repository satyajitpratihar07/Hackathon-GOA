import { useState, useEffect, useRef } from 'react';
import ParticleText from './ParticleText';

const STATS = [
  { value: '6800+', label: 'Registrations 2024' },
  { value: '390+',  label: 'Hackers' },
  { value: '100',   label: 'Projects' },
  { value: '$50K+', label: 'Bounties 2026' },
];

const TAGS = [
  '🤖 AI / ML', '⛓️ Web3', '🔐 Cybersecurity',
  '📱 Mobile', '🌐 Open Source', '🚀 Deep Tech',
  '💊 HealthTech', '🌿 ClimaTech',
];

export default function IntroScreen({ onDone }) {
  const [phase, setPhase] = useState('visible'); // 'visible' | 'fading' | 'done'
  const timerRef = useRef(null);

  const skip = () => {
    clearTimeout(timerRef.current);
    setPhase('fading');
    timerRef.current = setTimeout(() => { setPhase('done'); onDone?.(); }, 700);
  };

  useEffect(() => {
    // 4.3s display + 0.7s fade = 5s total
    timerRef.current = setTimeout(() => {
      setPhase('fading');
      timerRef.current = setTimeout(() => { setPhase('done'); onDone?.(); }, 700);
    }, 4300);
    return () => clearTimeout(timerRef.current);
  }, [onDone]);

  if (phase === 'done') return null;

  return (
    <div
      className={`hhg-intro-screen ${phase === 'fading' ? 'hhg-intro-screen--fade' : ''}`}
      aria-hidden="true"
    >
      {/* Background */}
      <div className="hhg-intro-bg" />

      {/* Top bar — event badge */}
      <div className="hhg-intro-topbar">
        <span className="hhg-intro-live-dot" />
        <span>LIVE EVENT · GOA, INDIA · 28–31 OCT 2026</span>
      </div>

      {/* Main particle title */}
      <div className="hhg-intro-content">
        <div className="hhg-intro-row1" style={{ height: 'clamp(70px, 12vh, 140px)' }}>
          <ParticleText
            text="Hacker House"
            particleSize={2.8}
            density={1.0}
            color="#ffffff"
            highlightColor="#E8C840"
            scatter={160}
            gatherDuration={2200}
            stagger={380}
            pointerRepel={0}
            repelRadius={0}
            idleDrift={0.5}
            trigger="mount"
            fontSize="clamp(2.8rem, 14vw, 6rem)"
            fontWeight={900}
            fontFamily="'Unbounded', sans-serif"
            glow={true}
          />
        </div>
        <div className="hhg-intro-row1-half" style={{ width: '100%', height: 'clamp(65px, 11vh, 130px)', marginTop: '-10px' }}>
          <ParticleText
            text="GOA"
            particleSize={2.8}
            density={1.0}
            color="#ffffff"
            highlightColor="#E8C840"
            scatter={160}
            gatherDuration={2200}
            stagger={380}
            pointerRepel={0}
            repelRadius={0}
            idleDrift={0.5}
            trigger="mount"
            fontSize="clamp(3.5rem, 18vw, 6.5rem)"
            fontWeight={900}
            fontFamily="'Unbounded', sans-serif"
            glow={true}
          />
        </div>
        <div className="hhg-intro-row2" style={{ marginTop: '-5px', height: 'clamp(90px, 14vh, 160px)' }}>
          <ParticleText
            text="2026"
            particleSize={2.5}
            density={1.0}
            color="#E8C840"
            highlightColor="#00FF88"
            scatter={180}
            gatherDuration={2000}
            stagger={350}
            pointerRepel={0}
            repelRadius={0}
            idleDrift={0.6}
            trigger="mount"
            fontSize="clamp(3.8rem, 24vw, 8.5rem)"
            fontWeight={900}
            fontFamily="'Unbounded', sans-serif"
            glow={true}
          />
        </div>

        {/* Stats row */}
        <div className="hhg-intro-stats">
          {STATS.map((s, i) => (
            <div className="hhg-intro-stat" key={s.label} style={{ animationDelay: `${2.6 + i * 0.15}s` }}>
              <span className="hhg-intro-stat-val">{s.value}</span>
              <span className="hhg-intro-stat-lbl">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Tech track tags */}
        <div className="hhg-intro-tags">
          {TAGS.map((tag, i) => (
            <span
              className="hhg-intro-tag"
              key={tag}
              style={{ animationDelay: `${3.0 + i * 0.1}s` }}
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Tagline */}
        <p className="hhg-intro-tagline">
          India's most electrifying beachside hackathon 🌊🔥
        </p>
      </div>

      {/* Skip button */}
      <button className="hhg-intro-skip" onClick={skip}>SKIP ›</button>
    </div>
  );
}
