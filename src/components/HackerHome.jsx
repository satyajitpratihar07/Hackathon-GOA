import React, { useState, useEffect, useRef } from 'react';
import './HackerHome.css';

export default function HackerHome({ onClose }) {
  const [isPowerOn, setIsPowerOn] = useState(true);
  const [isBooting, setIsBooting] = useState(false);

  const handlePowerToggle = () => {
    if (isPowerOn) {
      setIsPowerOn(false);
    } else {
      setIsPowerOn(true);
      setIsBooting(true);
      setTimeout(() => setIsBooting(false), 2500); // 2.5s boot sequence
    }
  };
  const [history, setHistory] = useState([
    { type: 'system', text: 'HH_GOA_26 OS // v4.0.1' },
    { type: 'system', text: 'Initializing root access...' },
    { type: 'success', text: 'Access Granted.' },
    { type: 'info', text: 'Auto-execution sequence initiated...' }
  ]);
  const [input, setInput] = useState('');
  const endRef = useRef(null);
  const logEndRef = useRef(null);

  // Auto-scrolling infinite breach log state (Right Monitor)
  const [breachLogs, setBreachLogs] = useState([]);

  // Auto-running Advanced Terminal Log (Left Monitor)
  useEffect(() => {
    const advancedLogs = [
      { type: 'command', text: 'root@goa-26:~$ execute biometric_scan.sh' },
      { type: 'system', text: '> Initiating Face Data Scan...' },
      { type: 'info', text: '  [||||||||||] 100% Face geometry acquired.' },
      { type: 'success', text: '  Match found in central DB: Target Verified.' },
      { type: 'command', text: 'root@goa-26:~$ inject_qr_payload --stealth' },
      { type: 'system', text: '> Running QR Code injection protocol...' },
      { type: 'info', text: '  Injecting bits... 01011001 01101111 01110101' },
      { type: 'success', text: '  QR payload successfully injected.' },
      { type: 'warning', text: '> Warning: Intrusion countermeasures detected.' },
      { type: 'info', text: '  Rerouting through proxy nodes... Success.' },
      { type: 'system', text: '> Extracting encrypted neural data...' },
      { type: 'command', text: 'root@goa-26:~$ run_exploit -target zero_day' },
      { type: 'info', text: '  Bypassing level 4 security protocols...' },
      { type: 'success', text: '  Root access elevated. Shell spawned.' },
      { type: 'warning', text: '  Tracing IP address... Masking connection.' },
      { type: 'system', text: '> Decrypting blockchain ledger...' }
    ];

    const interval = setInterval(() => {
      const newLog = advancedLogs[Math.floor(Math.random() * advancedLogs.length)];
      setHistory(prev => {
        const updated = [...prev, newLog];
        return updated.length > 20 ? updated.slice(updated.length - 20) : updated;
      });
    }, 1200);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll terminal to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  // Infinite running cybersecurity code loop
  useEffect(() => {
    const codeSnippets = [
      'Bypassing mainframe firewall [TCP/443]...',
      'Decrypting payload signature: 0x8F9A...',
      'Brute-force auth attempting: admin:admin...',
      'Injecting SQL wrapper into target node...',
      'Connecting to proxy proxy.goa-26.internal...',
      'Downloading encrypted data packet [4.2MB]...',
      'Memory dump: 0x00FF88 => Buffer overflow...',
      'Executing remote shell payload...',
      'Ping reply from 10.0.0.4: bytes=64 ttl=42',
      'Port scan: 22 [OPEN], 80 [OPEN], 443 [OPEN]',
      'Establishing reverse TCP connection...',
      'Fetching RSA-4096 private key chunks...',
      'Accessing secure vault partition...',
      'Masking IP: 192.168.x.x => 203.0.x.x...',
      'Compiling rootkit kernel module...'
    ];

    const interval = setInterval(() => {
      const newLog = codeSnippets[Math.floor(Math.random() * codeSnippets.length)];
      setBreachLogs(prev => [...prev.slice(-15), `> ${newLog}`]);
    }, 400);

    return () => clearInterval(interval);
  }, []);

  // Auto-scroll the breach log
  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [breachLogs]);

  const handleCommand = (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim().toLowerCase();
    const newHistory = [...history, { type: 'command', text: `root@goa-26:~$ ${input}` }];

    switch (cmd) {
      case 'help':
        newHistory.push(
          { type: 'info', text: 'Available commands: help, ping, hack, clear, whoami' }
        );
        break;
      case 'clear':
        setHistory([]);
        setInput('');
        return;
      case 'whoami':
        newHistory.push({ type: 'info', text: 'User: hacker_0x99 // Role: Builder' });
        break;
      default:
        newHistory.push({ type: 'error', text: `Command not found: ${cmd}` });
    }

    setHistory(newHistory);
    setInput('');
  };

  return (
    <div className="hhg-hacker-room-overlay">
      <div className="hhg-hr-container">
        <button className="hhg-hr-close" onClick={onClose}>[ EXIT ]</button>

        {/* 2.5D Room SVG Rendering */}
        <svg viewBox="0 0 1000 700" className="hhg-hr-svg" preserveAspectRatio="xMidYMid slice">
          {/* Walls */}
          <polygon points="0,0 650,0 650,700 0,700" fill="#E2D1A7" />
          <polygon points="650,0 1000,0 1000,700 650,700" fill="#DBCBA1" />
          
          {/* Wall Corner shadow */}
          <rect x="640" y="0" width="20" height="700" fill="#000" opacity="0.05" />

          {/* Posters on Right Wall */}
          <rect x="800" y="80" width="50" height="70" fill="#1E293B" stroke="#000" strokeWidth="4" transform="skewY(10)" />
          <rect x="880" y="90" width="45" height="60" fill="#334155" stroke="#000" strokeWidth="4" transform="skewY(10)" />
          <rect x="810" y="90" width="30" height="50" fill="#E11D48" transform="skewY(10)" />
          <rect x="890" y="100" width="25" height="40" fill="#00FF88" transform="skewY(10)" />

          {/* Floor */}
          <polygon points="0,500 1000,500 1000,700 0,700" fill="#9C6B30" />
          
          {/* Floor Wood Lines */}
          <g stroke="#7A4C22" strokeWidth="2" opacity="0.6">
            <line x1="0" y1="520" x2="1000" y2="520" />
            <line x1="0" y1="550" x2="1000" y2="550" />
            <line x1="0" y1="580" x2="1000" y2="580" />
            <line x1="0" y1="610" x2="1000" y2="610" />
            <line x1="0" y1="640" x2="1000" y2="640" />
            <line x1="0" y1="670" x2="1000" y2="670" />
            <line x1="0" y1="700" x2="1000" y2="700" />
            {/* Vertical floorboard gaps */}
            <line x1="150" y1="500" x2="100" y2="700" strokeWidth="1" />
            <line x1="300" y1="500" x2="250" y2="700" strokeWidth="1" />
            <line x1="450" y1="500" x2="400" y2="700" strokeWidth="1" />
            <line x1="600" y1="500" x2="550" y2="700" strokeWidth="1" />
            <line x1="750" y1="500" x2="700" y2="700" strokeWidth="1" />
            <line x1="900" y1="500" x2="850" y2="700" strokeWidth="1" />
          </g>

          {/* Desk shadow */}
          <polygon points="170,550 790,550 820,620 150,620" fill="#000" opacity="0.2" />

          {/* Desk Legs */}
          <rect x="220" y="470" width="12" height="150" fill="#F3F4F6" />
          <rect x="200" y="610" width="50" height="10" fill="#D1D5DB" />
          
          <rect x="730" y="470" width="12" height="150" fill="#F3F4F6" />
          <rect x="710" y="610" width="50" height="10" fill="#D1D5DB" />

          {/* Desk Top */}
          <polygon points="180,470 780,470 800,490 160,490" fill="#F4C47C" stroke="#DCA252" strokeWidth="2" />

          {/* Monitor Stands */}
          {/* Left Monitor Stand */}
          <ellipse cx="345" cy="470" rx="30" ry="8" fill="#111" />
          <rect x="335" y="350" width="20" height="120" fill="#222" />
          
          {/* Right Monitor Stand */}
          <ellipse cx="625" cy="470" rx="30" ry="8" fill="#111" />
          <rect x="615" y="350" width="20" height="120" fill="#222" />

          {/* Dual Monitor Bezels */}
          {/* Left Monitor Bezel */}
          <rect x="205" y="212" width="280" height="171" fill="#111" rx="4" />
          {/* Right Monitor Bezel */}
          <rect x="485" y="212" width="280" height="171" fill="#111" rx="4" />

          {/* PC Tower */}
          <rect x="60" y="520" width="100" height="160" fill="#0A0A0A" rx="4" />
          <polygon points="160,520 180,510 180,670 160,680" fill="#1A1A1A" />
          <polygon points="60,520 80,510 180,510 160,520" fill="#222" />
          <rect x="70" y="530" width="80" height="15" fill="#222" rx="2" />
          
          {/* Power Button Hint */}
          <g transform="translate(10, 0)">
            <text x="100" y="485" fill="#FFF" fontSize="11" fontFamily="monospace" textAnchor="middle" opacity="0.7">
              If you want computer {isPowerOn ? 'OFF' : 'ON'},
            </text>
            <text x="100" y="500" fill="#FFF" fontSize="11" fontFamily="monospace" textAnchor="middle" opacity="0.7">
              click power button
            </text>
            <path d="M 70,505 L 70,525 L 67,522 M 70,525 L 73,522" fill="none" stroke="#FFF" strokeWidth="1.5" opacity="0.5" />
          </g>

          {/* Power Button */}
          <circle 
            cx="80" cy="537" r="4.5" 
            fill={isPowerOn ? "#00FF88" : "#FF3333"} 
            filter="blur(0.5px)" 
            onClick={handlePowerToggle}
            style={{ cursor: 'pointer', transition: 'fill 0.3s' }}
          />

          {/* Cables from PC to Desk */}
          <path d="M 160,550 Q 250,650 350,480" fill="none" stroke="#111" strokeWidth="4" />
          <path d="M 160,570 Q 220,680 400,480" fill="none" stroke="#222" strokeWidth="3" />
          <path d="M 160,600 Q 350,680 480,480" fill="none" stroke="#000" strokeWidth="5" />

          {/* Herman Miller style Chair */}
          {/* Wheels Base */}
          <circle cx="700" cy="690" r="8" fill="#111" />
          <circle cx="820" cy="690" r="8" fill="#111" />
          <circle cx="760" cy="710" r="8" fill="#111" />
          <path d="M 760,660 L 700,690 M 760,660 L 820,690 M 760,660 L 760,710" stroke="#222" strokeWidth="6" strokeLinecap="round" />
          {/* Stem */}
          <rect x="750" y="580" width="20" height="80" fill="#111" />
          {/* Seat Base */}
          <ellipse cx="760" cy="580" rx="55" ry="20" fill="#222" />
          <ellipse cx="760" cy="580" rx="50" ry="15" fill="#333" /> {/* mesh hint */}
          {/* Armrests */}
          <path d="M 720,580 Q 700,500 700,480" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round" />
          <path d="M 800,580 Q 820,500 820,480" fill="none" stroke="#111" strokeWidth="8" strokeLinecap="round" />
          <path d="M 680,480 L 720,480" stroke="#333" strokeWidth="12" strokeLinecap="round" />
          <path d="M 800,480 L 840,480" stroke="#333" strokeWidth="12" strokeLinecap="round" />
          {/* Backrest Mesh */}
          <path d="M 720,570 C 720,380 800,380 800,570" fill="none" stroke="#111" strokeWidth="30" strokeLinecap="round" />
          <path d="M 720,570 C 720,380 800,380 800,570" fill="none" stroke="#333" strokeWidth="24" strokeLinecap="round" strokeDasharray="2 3" />
        </svg>

        {/* Monitor Overlays (HTML for scrolling text) */}
        {/* Left Monitor (Terminal) */}
        <div className="hhg-hr-monitor hhg-hr-monitor-left">
          {!isPowerOn ? null : isBooting ? (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a', color: '#fff' }}>
              <h2 style={{ color: '#00FF88', margin: 0, fontSize: '14px' }}>HH_GOA_26</h2>
              <p style={{ margin: '5px 0 0', fontSize: '8px', opacity: 0.7 }}>Loading Website Assets...</p>
            </div>
          ) : (
            <>
              <div className="hhg-hr-monitor-header">TERMINAL // HH_GOA_26</div>
              <div className="hhg-hr-monitor-body">
                {history.map((line, i) => (
                  <div key={i} className={`hhg-hr-log-line ${line.type}`}>
                    {line.text}
                  </div>
                ))}
                <div ref={endRef} />
                <form className="hhg-hr-input-wrapper" onSubmit={handleCommand}>
                  <span className="hhg-hr-prompt">root@goa:~$</span>
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    className="hhg-hr-input"
                    autoFocus
                    spellCheck="false"
                    autoComplete="off"
                  />
                </form>
              </div>
            </>
          )}
        </div>

        {/* Right Monitor (Breach Logs) */}
        <div className="hhg-hr-monitor hhg-hr-monitor-right">
          {!isPowerOn ? null : isBooting ? (
            <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#0a0a0a' }}>
              <div style={{ width: '20px', height: '20px', border: '2px solid rgba(0,255,136,0.3)', borderTopColor: '#00FF88', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
              <style>{`@keyframes spin { 100% { transform: rotate(360deg); } }`}</style>
            </div>
          ) : (
            <>
              <div className="hhg-hr-monitor-header">ACTIVE_BREACH_LOG</div>
              <div className="hhg-hr-monitor-body">
                {breachLogs.map((log, i) => (
                  <div key={i} className="hhg-hr-breach-line">{log}</div>
                ))}
                <div ref={logEndRef} />
              </div>
            </>
          )}
        </div>

      </div>
    </div>
  );
}
