import { useEffect, useRef, memo } from 'react';

// BgVideo: memoized forever — React NEVER touches it after first mount.
// No event listeners. Browser native autoPlay + loop handles everything.
const BgVideo = memo(function BgVideo() {
  const ref = useRef(null);

  useEffect(() => {
    // Single play() call to satisfy browser autoplay policy.
    // After this, native loop attribute handles seamless looping forever.
    ref.current?.play().catch(() => {});
  }, []);

  return (
    <video
      ref={ref}
      src="/cover.mp4"
      autoPlay
      loop
      muted
      playsInline
      preload="auto"
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        objectFit: 'cover',
        zIndex: 0,
        display: 'block',
        // GPU compositor layer — browser handles decode on dedicated GPU thread
        transform: 'translateZ(0)',
        backfaceVisibility: 'hidden',
        willChange: 'transform',
      }}
    />
  );
});

export default function HHGoaBackground({ onHouseClick, onRightHouseClick }) {
  return (
    <div className="hhg-cyber-bg-container" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', overflow: 'hidden' }}>

      {/* ── Isolated video — never affected by any React re-render ── */}
      <BgVideo />

      {/* ── Dark overlay ── */}
      <div style={{
        position: 'absolute',
        inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.08) 60%, rgba(13,59,30,0.5) 100%)',
        zIndex: 1,
        pointerEvents: 'none'
      }} />

      {/* ── Foreground SVG (beach elements ONLY, no wave JS animation) ── */}
      <svg
        className="hhg-scene-svg"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMax slice"
        xmlns="http://www.w3.org/2000/svg"
        style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', zIndex: 2 }}
      >
        {/* ── SVG z-index sits above video ── */}
        <defs>
          {/* Sand Gradient */}
          <linearGradient id="cyberSandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#D4B483" />
            <stop offset="100%" stopColor="#8B5A2B" />
          </linearGradient>

          {/* Palm leaf gradients */}
          <linearGradient id="palmLeafG1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#0D3B1E" />
          </linearGradient>
          <linearGradient id="palmLeafG2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C840" />
            <stop offset="100%" stopColor="#0D3B1E" />
          </linearGradient>
          <linearGradient id="palmLeafGPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF1B8D" />
            <stop offset="100%" stopColor="#0D3B1E" />
          </linearGradient>
          <linearGradient id="trunkG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D3B1E" />
            <stop offset="50%" stopColor="#2D6B44" />
            <stop offset="100%" stopColor="#0A2211" />
          </linearGradient>
        </defs>

        {/* Water-to-sand transition gradient overlay (blends video water into sand) */}
        <defs>
          <linearGradient id="waterToSandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="transparent" />
            <stop offset="75%" stopColor="transparent" />
            <stop offset="90%" stopColor="#C9A96E" stopOpacity="0.5" />
            <stop offset="100%" stopColor="#D4B483" stopOpacity="1" />
          </linearGradient>
        </defs>

        {/* Smooth water→sand gradient blend over the video */}
        <rect x="0" y="0" width="1440" height="900" fill="url(#waterToSandGrad)" />

        {/* Wave Shorelines — fully static, zero browser repaint cost */}
        <path
          d="M -50 730 Q 360 720 720 730 T 1490 730 L 1490 770 L -50 770 Z"
          fill="#0D3B1E"
          opacity="0.3"
        />
        <path
          d="M -50 742 Q 360 737 720 742 T 1490 742 L 1490 770 L -50 770 Z"
          fill="#FFFFFF"
          opacity="0.15"
        />

        {/* Sand Beach */}
        <path d="M -50 752 Q 360 730 720 742 T 1490 752 L 1490 1000 L -50 1000 Z" fill="url(#cyberSandGrad)" />


        {/* Beach people — bigger scale */}
        <g fill="#FFFFFF" stroke="#0D3B1E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          {/* Person 1 (walking left) */}
          <g transform="translate(180, 698) scale(2.2)">
            <circle cx="5" cy="0" r="3" />
            <path d="M 5 3 L 5 12 M 5 12 L 0 20 M 5 12 L 8 20 M 5 5 L 0 10 M 5 5 L 10 10" fill="none" />
          </g>
          {/* Person 2 (walking right) */}
          <g transform="translate(1150, 710) scale(2.2)">
            <circle cx="5" cy="0" r="3" />
            <path d="M 5 3 L 5 12 M 5 12 L 2 20 M 5 12 L 10 20 M 5 5 L 0 10 M 5 5 L 8 10" fill="none" />
          </g>
        </g>

        {/* Surfboards — bigger */}
        <g transform="translate(730, 692) scale(1.8)">
          {/* Shadow */}
          <ellipse cx="15" cy="50" rx="20" ry="6" fill="#A57A4C" opacity="0.5" stroke="none" />
          <path d="M 0 50 Q 5 0 10 0 Q 15 0 20 50 Z" fill="#FFFFFF" stroke="#0D3B1E" strokeWidth="2" />
          <path d="M 10 0 L 10 50" stroke="#0D3B1E" strokeWidth="2" />
          <path d="M 12 52 Q 17 5 22 5 Q 27 5 32 52 Z" fill="#FFCA28" stroke="#0D3B1E" strokeWidth="2" transform="rotate(15, 22, 50)" />
        </g>

        {/* Wooden Signboard (Click home) */}
        <g transform="translate(310, 720) scale(1.1)" onClick={onHouseClick} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
          {/* Post Shadow */}
          <ellipse cx="62" cy="140" rx="15" ry="5" fill="#000000" opacity="0.2" />
          {/* Wooden Pole */}
          <rect x="55" y="70" width="15" height="70" fill="#8B5A2B" stroke="#5C3317" strokeWidth="2" />
          <g transform="translate(0, 35)">
            {/* Arrow Board Pointing Left */}
            <path d="M 15 20 L 35 0 L 120 0 Q 125 0 125 5 L 125 35 Q 125 40 120 40 L 35 40 Z" fill="#C17A3E" stroke="#5C3317" strokeWidth="3" strokeLinejoin="round" />
            {/* Wood Grain Highlights */}
            <path d="M 35 8 Q 70 4 110 10 M 25 18 Q 80 23 115 16 M 35 32 Q 70 36 110 28" fill="none" stroke="#9C5D2A" strokeWidth="1.5" />
            {/* Nails */}
            <circle cx="65" cy="10" r="2" fill="#4A5568" stroke="#1A202C" strokeWidth="0.5" />
            <circle cx="65" cy="20" r="2" fill="#4A5568" stroke="#1A202C" strokeWidth="0.5" />
            <circle cx="65" cy="30" r="2" fill="#4A5568" stroke="#1A202C" strokeWidth="0.5" />
            {/* Sign Text */}
            <text x="75" y="24" fill="#3E2723" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" style={{ letterSpacing: '1px' }}>
              Click home
            </text>
          </g>
        </g>

        {/* Wooden Signboard (Terminal -> Security) */}
        <g transform="translate(980, 730) scale(1.1)" onClick={onRightHouseClick} style={{ cursor: 'pointer', pointerEvents: 'auto' }}>
          {/* Post Shadow */}
          <ellipse cx="62" cy="140" rx="15" ry="5" fill="#000000" opacity="0.2" />
          {/* Wooden Pole */}
          <rect x="55" y="70" width="15" height="70" fill="#8B5A2B" stroke="#5C3317" strokeWidth="2" />
          <g transform="translate(0, 35)">
            {/* Arrow Board Pointing Right */}
            <path d="M 125 20 L 105 0 L 20 0 Q 15 0 15 5 L 15 35 Q 15 40 20 40 L 105 40 Z" fill="#C17A3E" stroke="#5C3317" strokeWidth="3" strokeLinejoin="round" />
            {/* Wood Grain Highlights */}
            <path d="M 105 8 Q 70 4 30 10 M 115 18 Q 60 23 25 16 M 105 32 Q 70 36 30 28" fill="none" stroke="#9C5D2A" strokeWidth="1.5" />
            {/* Nails */}
            <circle cx="65" cy="10" r="2" fill="#4A5568" stroke="#1A202C" strokeWidth="0.5" />
            <circle cx="65" cy="20" r="2" fill="#4A5568" stroke="#1A202C" strokeWidth="0.5" />
            <circle cx="65" cy="30" r="2" fill="#4A5568" stroke="#1A202C" strokeWidth="0.5" />
            {/* Sign Text */}
            <text x="65" y="24" fill="#3E2723" fontSize="13" fontWeight="bold" fontFamily="sans-serif" textAnchor="middle" style={{ letterSpacing: '1px' }}>
              Security
            </text>
          </g>
        </g>

        {/* Umbrellas and Loungers Group 1 — bigger */}
        <g transform="translate(380, 655) scale(1.6)">
          {/* Shadow */}
          <ellipse cx="60" cy="50" rx="40" ry="10" fill="#A57A4C" opacity="0.5" stroke="none" />
          {/* Loungers */}
          <path d="M 10 45 L 30 45 L 40 30" stroke="#0D3B1E" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 15 45 L 15 50 M 25 45 L 25 50 M 35 38 L 35 50" stroke="#0D3B1E" strokeWidth="2" strokeLinecap="round" />

          <path d="M 45 48 L 65 48 L 75 33" stroke="#0D3B1E" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 50 48 L 50 53 M 60 48 L 60 53 M 70 41 L 70 53" stroke="#0D3B1E" strokeWidth="2" strokeLinecap="round" />
          {/* Umbrella Pole */}
          <line x1="60" y1="45" x2="60" y2="0" stroke="#0D3B1E" strokeWidth="3" />
          {/* Umbrella Canopy */}
          <path d="M 20 0 Q 60 -20 100 0 Q 60 10 20 0 Z" fill="#FFFFFF" stroke="#0D3B1E" strokeWidth="2" />
          <path d="M 40 -10 Q 60 -20 80 -10 Q 60 10 40 -10 Z" fill="#FFCA28" stroke="#0D3B1E" strokeWidth="1" />
        </g>

        {/* Umbrellas and Loungers Group 2 — bigger */}
        <g transform="translate(585, 670) scale(1.35)">
          <ellipse cx="60" cy="50" rx="40" ry="10" fill="#A57A4C" opacity="0.5" stroke="none" />
          <path d="M 10 45 L 30 45 L 40 30" stroke="#0D3B1E" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 15 45 L 15 50 M 25 45 L 25 50 M 35 38 L 35 50" stroke="#0D3B1E" strokeWidth="2" strokeLinecap="round" />
          <path d="M 45 48 L 65 48 L 75 33" stroke="#0D3B1E" strokeWidth="3" fill="none" strokeLinecap="round" />
          <path d="M 50 48 L 50 53 M 60 48 L 60 53 M 70 41 L 70 53" stroke="#0D3B1E" strokeWidth="2" strokeLinecap="round" />
          <line x1="60" y1="45" x2="60" y2="0" stroke="#0D3B1E" strokeWidth="3" />
          <path d="M 20 0 Q 60 -20 100 0 Q 60 10 20 0 Z" fill="#FFFFFF" stroke="#0D3B1E" strokeWidth="2" />
          <path d="M 40 -10 Q 60 -20 80 -10 Q 60 10 40 -10 Z" fill="#FFCA28" stroke="#0D3B1E" strokeWidth="1" />
        </g>

        {/* GOA BEACH Shack — bigger */}
        <g transform="translate(890, 620) scale(1.5)">
          {/* Shadows */}
          <rect x="-10" y="80" width="140" height="20" fill="#A57A4C" opacity="0.5" stroke="none" />

          {/* Building */}
          <rect x="0" y="20" width="120" height="60" fill="#FFFFFF" stroke="#0D3B1E" strokeWidth="3" />

          {/* Green Roof */}
          <polygon points="-10,20 60,-20 130,20" fill="#059669" stroke="#0D3B1E" strokeWidth="3" strokeLinejoin="round" />
          <polygon points="60,-20 130,20 160,20 90,-20" fill="#047857" stroke="#0D3B1E" strokeWidth="3" strokeLinejoin="round" />

          {/* Side Wall */}
          <polygon points="120,20 150,20 150,80 120,80" fill="#E2E8F0" stroke="#0D3B1E" strokeWidth="3" />
          <rect x="125" y="30" width="20" height="50" fill="#0D3B1E" stroke="none" />

          {/* Service Window */}
          <rect x="10" y="35" width="100" height="25" fill="#1F2937" stroke="#0D3B1E" strokeWidth="2" />
          {/* Bartender Silhouette */}
          <path d="M 50 60 L 55 50 Q 60 45 65 50 L 70 60 Z" fill="#FFFFFF" stroke="none" />
          <circle cx="60" cy="45" r="4" fill="#FFFFFF" stroke="none" />

          {/* Pink GOA BEACH Sign */}
          <rect x="30" y="5" width="60" height="15" fill="#E11D48" stroke="#0D3B1E" strokeWidth="2" />
          <text x="60" y="16" fill="#FFFFFF" fontSize="10" fontWeight="bold" textAnchor="middle" fontFamily="sans-serif" stroke="none">GOA BEACH</text>

          {/* Counter Bar */}
          <rect x="5" y="60" width="110" height="5" fill="#FFCA28" stroke="#0D3B1E" strokeWidth="2" />

          {/* Stools */}
          <path d="M 30 80 L 30 65 M 25 80 L 25 65 M 22 65 L 33 65" stroke="#0D3B1E" strokeWidth="2" strokeLinecap="round" />
          <path d="M 60 80 L 60 65 M 55 80 L 55 65 M 52 65 L 63 65" stroke="#0D3B1E" strokeWidth="2" strokeLinecap="round" />
          <path d="M 90 80 L 90 65 M 85 80 L 85 65 M 82 65 L 93 65" stroke="#0D3B1E" strokeWidth="2" strokeLinecap="round" />
        </g>

        {/* Foreground Houses (Framing the scene) */}
        {/* Left House */}
        <SeasideCottage 
          x={-40} 
          y={735} 
          label="SECURITY ROOM" 
          color="#00FF88" 
          onClick={onHouseClick} 
        />

        {/* Right House */}
        <SeasideCottage 
          x={1190} 
          y={755} 
          label="TERMINAL" 
          color="#FF3333" 
          onClick={onRightHouseClick} 
          flip={false} 
        />
      </svg>

      {/* Responsive Left Palm Trees */}
      <svg
        className="hhg-palm-tree-container"
        viewBox="-300 -300 850 1150"
        style={{
          position: 'absolute',
          left: '-20px',
          bottom: '-30px',
          height: '115vh',
          maxHeight: '1150px',
          width: 'auto',
          zIndex: 5,
          pointerEvents: 'none',
          overflow: 'visible'
        }}
      >
        <defs>
          <linearGradient id="palmLeafG1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#0D3B1E" />
          </linearGradient>
          <linearGradient id="palmLeafG2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C840" />
            <stop offset="100%" stopColor="#0D3B1E" />
          </linearGradient>
          <linearGradient id="palmLeafGPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF1B8D" />
            <stop offset="100%" stopColor="#0D3B1E" />
          </linearGradient>
          <linearGradient id="trunkG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D3B1E" />
            <stop offset="50%" stopColor="#2D6B44" />
            <stop offset="100%" stopColor="#0A2211" />
          </linearGradient>
        </defs>
        {/* Main Lush Tree */}
        <PalmTree x={10} trunkTop={160} trunkBottom={830} lean={130} size={1.35} />
      </svg>

      {/* Responsive Right Palm Trees */}
      <svg
        className="hhg-palm-tree-container"
        viewBox="-300 -300 850 1150"
        style={{
          position: 'absolute',
          right: '-20px',
          bottom: '-30px',
          height: '115vh',
          maxHeight: '1150px',
          width: 'auto',
          zIndex: 5,
          pointerEvents: 'none',
          transform: 'scaleX(-1)',
          overflow: 'visible'
        }}
      >
        <defs>
          <linearGradient id="palmLeafG1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00FF88" />
            <stop offset="100%" stopColor="#0D3B1E" />
          </linearGradient>
          <linearGradient id="palmLeafG2" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E8C840" />
            <stop offset="100%" stopColor="#0D3B1E" />
          </linearGradient>
          <linearGradient id="palmLeafGPink" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FF1B8D" />
            <stop offset="100%" stopColor="#0D3B1E" />
          </linearGradient>
          <linearGradient id="trunkG" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#0D3B1E" />
            <stop offset="50%" stopColor="#2D6B44" />
            <stop offset="100%" stopColor="#0A2211" />
          </linearGradient>
        </defs>
        {/* Main Lush Tree */}
        <PalmTree x={10} trunkTop={160} trunkBottom={830} lean={130} size={1.35} />
      </svg>
    </div>
  );
}

/* ── Realistic Seaside Cottage Sub-component ── */
function SeasideCottage({ x, y, flip, label, color, onClick }) {
  const sX = flip ? -1 : 1;

  return (
    <g 
      transform={`translate(${x}, ${y}) scale(1.15)`}
      className="hhg-clickable-house"
      onClick={onClick}
      style={{ pointerEvents: 'auto', cursor: 'pointer' }}
    >
      <g transform={`scale(${sX}, 1)`}>
        {/* Base Sand/Shadow */}
        <ellipse cx="120" cy="210" rx="140" ry="25" fill="#000000" opacity="0.2" />

        {/* Stone Steps */}
        <polygon points="170,225 250,225 240,210 180,210" fill="#64748B" />
        <polygon points="180,210 240,210 230,195 185,195" fill="#94A3B8" />

        {/* Side Wall (Receding) */}
        <polygon points="170,50 220,60 220,195 170,210" fill="#E2E8F0" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
        {/* Main Front Wall */}
        <polygon points="20,50 170,50 170,210 20,210" fill="#F8FAFC" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />
        {/* Gable Triangle */}
        <polygon points="20,50 95,-40 170,50" fill="#F8FAFC" stroke="#475569" strokeWidth="2" strokeLinejoin="round" />

        {/* Roof Drop Shadow on Walls */}
        <polygon points="20,50 95,-40 170,50 170,65 95,-20 20,65" fill="#000000" opacity="0.15" />
        <polygon points="170,50 220,60 220,75 170,65" fill="#000000" opacity="0.15" />

        {/* Timber Framing (Tudor Beams) */}
        <line x1="20" y1="50" x2="170" y2="50" stroke="#3E2723" strokeWidth="4" />
        <line x1="20" y1="210" x2="170" y2="210" stroke="#3E2723" strokeWidth="6" />
        <line x1="20" y1="50" x2="20" y2="210" stroke="#3E2723" strokeWidth="5" />
        <line x1="170" y1="50" x2="170" y2="210" stroke="#3E2723" strokeWidth="5" />
        <line x1="95" y1="-40" x2="95" y2="50" stroke="#3E2723" strokeWidth="4" />
        <line x1="20" y1="50" x2="95" y2="50" stroke="#3E2723" strokeWidth="4" />
        <line x1="20" y1="50" x2="95" y2="-40" stroke="#3E2723" strokeWidth="6" />
        <line x1="170" y1="50" x2="95" y2="-40" stroke="#3E2723" strokeWidth="6" />
        
        {/* Side Timber */}
        <line x1="170" y1="210" x2="220" y2="195" stroke="#3E2723" strokeWidth="4" />
        <line x1="220" y1="60" x2="220" y2="195" stroke="#3E2723" strokeWidth="4" />
        <line x1="170" y1="50" x2="220" y2="60" stroke="#3E2723" strokeWidth="4" />

        {/* Door */}
        <rect x="175" y="110" width="40" height="85" fill="#5D4037" stroke="#3E2723" strokeWidth="2" />
        <line x1="185" y1="110" x2="185" y2="195" stroke="#3E2723" strokeWidth="1.5" />
        <line x1="195" y1="110" x2="195" y2="195" stroke="#3E2723" strokeWidth="1.5" />
        <line x1="205" y1="110" x2="205" y2="195" stroke="#3E2723" strokeWidth="1.5" />
        <rect x="185" y="125" width="20" height="25" fill="#FFCA28" stroke="#3E2723" strokeWidth="2" />
        <circle cx="180" cy="160" r="3" fill="#FBC02D" />

        {/* Porch Roof Shadow */}
        <polygon points="175,90 220,100 220,120 175,110" fill="#000000" opacity="0.2" />

        {/* Porch Roof */}
        <polygon points="165,100 230,110 245,85 175,75" fill="#D4B853" stroke="#8D6E63" strokeWidth="2" strokeLinejoin="round" />
        {/* Porch Roof Depth */}
        <polygon points="230,110 245,85 242,95 227,120" fill="#C19A44" stroke="#8D6E63" strokeWidth="1.5" />
        
        {/* Porch Pillars */}
        <rect x="220" y="105" width="4" height="95" fill="#5D4037" />
        <rect x="235" y="90" width="4" height="110" fill="#3E2723" />

        {/* Window Shadow */}
        <polygon points="50,110 120,110 120,130 50,130" fill="#000000" opacity="0.2" />

        {/* Ground Floor Window Inset */}
        <rect x="60" y="110" width="50" height="60" fill="#475569" stroke="#3E2723" strokeWidth="3" />
        <polygon points="60,110 110,110 105,115 65,115" fill="#334155" />
        <polygon points="110,110 110,170 105,165 105,115" fill="#1E293B" />
        <rect x="65" y="115" width="40" height="50" fill="#FFCA28" />
        <polygon points="65,115 95,115 95,135 65,165" fill="#FFE082" opacity="0.4" />
        <line x1="85" y1="115" x2="85" y2="165" stroke="#1E293B" strokeWidth="2" />
        <line x1="65" y1="140" x2="105" y2="140" stroke="#1E293B" strokeWidth="2" />
        
        {/* Window Awning */}
        <polygon points="50,110 120,110 130,90 60,90" fill="#D4B853" stroke="#8D6E63" strokeWidth="2" strokeLinejoin="round" />
        {/* Awning Depth */}
        <polygon points="120,110 130,90 125,95 115,115" fill="#C19A44" stroke="#8D6E63" strokeWidth="1.5" />

        {/* Flower Box 3D */}
        <rect x="55" y="170" width="60" height="15" fill="#795548" stroke="#3E2723" strokeWidth="2" rx="2" />
        <polygon points="115,170 125,165 125,180 115,185" fill="#5D4037" stroke="#3E2723" strokeWidth="1.5" />
        
        {/* Flowers */}
        <circle cx="65" cy="165" r="8" fill="#4CAF50" />
        <circle cx="85" cy="165" r="9" fill="#2E7D32" />
        <circle cx="105" cy="165" r="8" fill="#4CAF50" />
        <circle cx="65" cy="163" r="3" fill="#FFF" /> <circle cx="65" cy="163" r="1" fill="#FDD835" />
        <circle cx="85" cy="162" r="3" fill="#FFF" /> <circle cx="85" cy="162" r="1" fill="#FDD835" />
        <circle cx="105" cy="163" r="3" fill="#FFF" /> <circle cx="105" cy="163" r="1" fill="#FDD835" />

        {/* Gable Window Inset */}
        <rect x="75" y="-10" width="40" height="40" fill="#475569" stroke="#3E2723" strokeWidth="3" />
        <polygon points="75,-10 115,-10 110,-5 80,-5" fill="#334155" />
        <polygon points="115,-10 115,30 110,25 110,-5" fill="#1E293B" />
        <rect x="80" y="-5" width="30" height="30" fill="#FFCA28" />
        <polygon points="80,-5 100,-5 100,5 80,25" fill="#FFE082" opacity="0.4" />
        <line x1="95" y1="-5" x2="95" y2="25" stroke="#1E293B" strokeWidth="2" />
        <line x1="80" y1="10" x2="110" y2="10" stroke="#1E293B" strokeWidth="2" />

        {/* Chimney */}
        <rect x="140" y="-100" width="25" height="120" fill="#94A3B8" stroke="#475569" strokeWidth="2" />
        <polygon points="135,-105 170,-105 170,-100 135,-100" fill="#64748B" stroke="#475569" strokeWidth="2" />

        {/* Main Thatched Roof Layers */}
        {/* Left Front Edge (Fascia thickness, darker) */}
        <polygon points="0,60 95,-55 95,-40 20,50" fill="#C19A44" stroke="#8D6E63" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Right Front Edge (Fascia thickness, darker) */}
        <polygon points="95,-55 190,60 170,50 95,-40" fill="#C19A44" stroke="#8D6E63" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Main Right Roof Surface (Receding) */}
        <polygon points="95,-55 190,60 240,70 145,-45" fill="#D4B853" stroke="#8D6E63" strokeWidth="2" strokeLinejoin="round" />
        
        {/* Thatch edge highlights on main roof bottom edge */}
        <polygon points="190,60 240,70 235,60 185,50" fill="#E6C280" opacity="0.7" />
        
        {/* Roof Thatch Texture Lines on Right Surface */}
        <path d="M 95,-55 L 190,60 M 105,-53 L 200,62 M 115,-51 L 210,64 M 125,-49 L 220,66 M 135,-47 L 230,68 M 145,-45 L 240,70" stroke="#A57A4C" strokeWidth="2" opacity="0.5" />

        {/* Shrubs Base */}
        <path d="M -10,210 Q -20,180 10,170 Q 30,140 50,180 Q 70,160 80,210 Z" fill="#2E7D32" />
        <path d="M -20,210 Q -30,190 -5,185 Q 15,160 30,195 Q 45,180 60,210 Z" fill="#4CAF50" />
      </g>

      {/* Label Signboard (Wooden post, not flipped) */}
      <g transform="translate(35, 220)">
        <rect x="20" y="-30" width="6" height="30" fill="#3E2723" />
        <rect x="114" y="-30" width="6" height="30" fill="#3E2723" />
        <rect x="0" y="-55" width="140" height="25" fill="#27140C" stroke="#3E2723" strokeWidth="2" rx="3" />
        <text x="70" y="-38" fill={color} fontSize="12" fontWeight="bold" fontFamily="monospace" textAnchor="middle" style={{ filter: `drop-shadow(0 0 5px ${color})` }}>{label}</text>
      </g>
    </g>
  );
}

/* ── Coconut Palm Tree Sub-component ── */
function PalmTree({ x, trunkTop, trunkBottom, lean, size }) {
  const tx = x + lean * 1.35;
  const ty = (trunkTop + trunkBottom) / 2 + 20;
  const cx = x + lean;
  const cy = trunkTop;

  const s = size;
  const segments = 20;
  const trunkPaths = [];

  // Generate stacked-segment trunk (beige with dark brown stripes)
  for (let idx = 0; idx < segments; idx++) {
    const t1 = idx / segments;
    const t2 = (idx + 1) / segments;

    const px1 = (1 - t1) * (1 - t1) * x + 2 * (1 - t1) * t1 * tx + t1 * t1 * cx;
    const py1 = (1 - t1) * (1 - t1) * trunkBottom + 2 * (1 - t1) * t1 * ty + t1 * t1 * cy;

    const px2 = (1 - t2) * (1 - t2) * x + 2 * (1 - t2) * t2 * tx + t2 * t2 * cx;
    const py2 = (1 - t2) * (1 - t2) * trunkBottom + 2 * (1 - t2) * t2 * ty + t2 * t2 * cy;

    const dx1 = 2 * (1 - t1) * (tx - x) + 2 * t1 * (cx - tx);
    const dy1 = 2 * (1 - t1) * (ty - trunkBottom) + 2 * t1 * (cy - ty);
    const angle1 = Math.atan2(dy1, dx1) + Math.PI / 2;

    // Tapering width
    const w1 = (28 - t1 * 14) * s;
    const w2 = (28 - t2 * 14) * s;

    // Segment points to create stacked cups
    const x1_l = px1 - Math.cos(angle1) * w1;
    const y1_l = py1 - Math.sin(angle1) * w1;
    const x1_r = px1 + Math.cos(angle1) * w1;
    const y1_r = py1 + Math.sin(angle1) * w1;

    // Calculate angle for the next point for the cup effect
    const dx2 = 2 * (1 - t2) * (tx - x) + 2 * t2 * (cx - tx);
    const dy2 = 2 * (1 - t2) * (ty - trunkBottom) + 2 * t2 * (cy - ty);
    const angle2 = Math.atan2(dy2, dx2) + Math.PI / 2;
    const x2_l = px2 - Math.cos(angle2) * w2;
    const y2_l = py2 - Math.sin(angle2) * w2;
    const x2_r = px2 + Math.cos(angle2) * w2;
    const y2_r = py2 + Math.sin(angle2) * w2;

    trunkPaths.push(
      <g key={idx}>
        <path
          d={`M ${x1_l} ${y1_l} L ${x2_l} ${y2_l} Q ${px2} ${py2 + 5 * s} ${x2_r} ${y2_r} L ${x1_r} ${y1_r} Q ${px1} ${py1 + 10 * s} ${x1_l} ${y1_l}`}
          fill="#E6C280"
          stroke="#5C4033"
          strokeWidth="2"
        />
        {/* Ridge shadow */}
        <path
          d={`M ${x1_l} ${y1_l} Q ${px1} ${py1 + 10 * s} ${x1_r} ${y1_r}`}
          fill="none"
          stroke="#8B5A2B"
          strokeWidth="3"
        />
      </g>
    );
  }

  return (
    <g>
      {/* Trunk segments */}
      {trunkPaths}

      {/* Swaying Canopy */}
      <g style={{ transformOrigin: `${cx}px ${cy}px`, animation: 'hhgFrondSwayLeft 5s ease-in-out infinite' }}>
        {/* Tropical Green Leaves - Spaced and alternating lengths to prevent grid overlap */}
        <Leaf cx={cx} cy={cy} angle={-170} len={200 * s} />
        <Leaf cx={cx} cy={cy} angle={-145} len={280 * s} />
        <Leaf cx={cx} cy={cy} angle={-115} len={240 * s} />
        <Leaf cx={cx} cy={cy} angle={-90}  len={320 * s} />
        <Leaf cx={cx} cy={cy} angle={-65}  len={240 * s} />
        <Leaf cx={cx} cy={cy} angle={-35}  len={280 * s} />
        <Leaf cx={cx} cy={cy} angle={-10}  len={200 * s} />
        <Leaf cx={cx} cy={cy} angle={20}   len={160 * s} />

        {/* Small leaves around the center near coconuts */}
        <Leaf cx={cx} cy={cy} angle={160} len={120 * s} />
        <Leaf cx={cx} cy={cy} angle={135} len={140 * s} />
        <Leaf cx={cx} cy={cy} angle={100} len={150 * s} />
        <Leaf cx={cx} cy={cy} angle={80}  len={150 * s} />
        <Leaf cx={cx} cy={cy} angle={45}  len={140 * s} />

        {/* Coconuts (Brown) */}
        <circle cx={cx - 15 * s} cy={cy + 15 * s} r={14 * s} fill="#5C4033" stroke="#3E2723" strokeWidth="2" />
        <circle cx={cx + 12 * s} cy={cy + 10 * s} r={15 * s} fill="#6D4C41" stroke="#3E2723" strokeWidth="2" />
        <circle cx={cx} cy={cy + 22 * s} r={13 * s} fill="#4E342E" stroke="#3E2723" strokeWidth="2" />
        <circle cx={cx - 5 * s} cy={cy + 10 * s} r={12 * s} fill="#795548" stroke="#3E2723" strokeWidth="2" />

        {/* Three dot marks on a coconut */}
        <circle cx={cx + 8 * s} cy={cy + 6 * s} r={1.5} fill="#3E2723" />
        <circle cx={cx + 12 * s} cy={cy + 12 * s} r={1.5} fill="#3E2723" />
      </g>
    </g>
  );
}

function Leaf({ cx, cy, angle, len }) {
  const rad = (angle * Math.PI) / 180;
  const baseOutX = Math.cos(rad);
  const baseOutY = Math.sin(rad);

  const tx = cx + baseOutX * len;
  const ty = cy + baseOutY * len + (len * 0.65);
  const droopX = cx + baseOutX * len * 0.5;
  const droopY = cy + baseOutY * len * 0.5 - (len * 0.35);

  const leafletsCount = 45; // Restored denser look
  const paths = [];

  for (let i = 1; i <= leafletsCount; i++) {
    const t = i / leafletsCount;
    const tPrev = (i - 1) / leafletsCount;

    // Current point on central spine
    const lx = (1 - t) * (1 - t) * cx + 2 * (1 - t) * t * droopX + t * t * tx;
    const ly = (1 - t) * (1 - t) * cy + 2 * (1 - t) * t * droopY + t * t * ty;

    // Previous point for drawing the tapered spine segment
    const px = (1 - tPrev) * (1 - tPrev) * cx + 2 * (1 - tPrev) * tPrev * droopX + tPrev * tPrev * tx;
    const py = (1 - tPrev) * (1 - tPrev) * cy + 2 * (1 - tPrev) * tPrev * droopY + tPrev * tPrev * ty;

    // Taper the spine so it ends in a sharp point instead of a blunt stick
    const spineW = Math.max(1, 7 * (1 - t));
    paths.push(
      <line key={`s-${i}`} x1={px} y1={py} x2={lx} y2={ly} stroke="#1B5E20" strokeWidth={spineW} strokeLinecap="round" />
    );

    // Tangent angle
    const dx = 2 * (1 - t) * (droopX - cx) + 2 * t * (tx - droopX);
    const dy = 2 * (1 - t) * (droopY - cy) + 2 * t * (ty - droopY);
    const tangent = Math.atan2(dy, dx);

    // Leaflets taper but never go to 0 length so they form a proper tip
    const leafletLen = len * 0.4 * (1 - t * 0.6); 

    // Spread angle narrows towards the tip so they point forward like a real palm leaf
    const spread = (75 - 65 * t) * (Math.PI / 180);
    const angleLeft = tangent - spread;
    const angleRight = tangent + spread;

    let lxEnd = lx + Math.cos(angleLeft) * leafletLen;
    let lyEnd = ly + Math.sin(angleLeft) * leafletLen;
    let rxEnd = lx + Math.cos(angleRight) * leafletLen;
    let ryEnd = ly + Math.sin(angleRight) * leafletLen;

    const gravity = leafletLen * 0.3;
    lyEnd += gravity;
    ryEnd += gravity;

    const strokeW = Math.max(1.5, 6 * (1 - t * 0.8));

    const lcx = lx + Math.cos(angleLeft) * leafletLen * 0.5;
    const lcy = ly + Math.sin(angleLeft) * leafletLen * 0.5 + gravity * 0.4;
    const rcx = lx + Math.cos(angleRight) * leafletLen * 0.5;
    const rcy = ly + Math.sin(angleRight) * leafletLen * 0.5 + gravity * 0.4;

    paths.push(
      <path key={`l-${i}`} d={`M ${lx} ${ly} Q ${lcx} ${lcy} ${lxEnd} ${lyEnd}`} stroke="#4CAF50" strokeWidth={strokeW} fill="none" strokeLinecap="round" />
    );
    paths.push(
      <path key={`r-${i}`} d={`M ${lx} ${ly} Q ${rcx} ${rcy} ${rxEnd} ${ryEnd}`} stroke="#2E7D32" strokeWidth={strokeW} fill="none" strokeLinecap="round" />
    );
  }

  return <g>{paths}</g>;
}

function Flower({ cx, cy, scale }) {
  const petals = [];
  for (let i = 0; i < 5; i++) {
    const angle = (i * 72 * Math.PI) / 180;
    const px = cx + Math.cos(angle) * 14 * scale;
    const py = cy + Math.sin(angle) * 14 * scale;
    petals.push(
      <circle key={i} cx={px} cy={py} r={9 * scale} fill="#FF4081" stroke="#C2185B" strokeWidth="1.5" />
    );
  }
  return (
    <g>
      {petals}
      <circle cx={cx} cy={cy} r={7 * scale} fill="#FFEB3B" stroke="#F57F17" strokeWidth="1.5" />
    </g>
  );
}

