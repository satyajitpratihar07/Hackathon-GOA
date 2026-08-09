import React, { useState, useEffect } from 'react';

export default function AdvancedScanners() {
  const [scanType, setScanType] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setScanType(prev => (prev + 1) % 4);
    }, 3000); // Switch every 3 seconds
    return () => clearInterval(interval);
  }, []);

  const titles = [
    'QR_PAYLOAD_SCAN',
    'BIOMETRIC_FACE_SCAN',
    'AI_CORE_UPLINK',
    'MAINFRAME_OVERRIDE'
  ];

  return (
    <div className="hhg-hh-panel">
      <div className="hhg-hh-panel-title">{titles[scanType]}</div>
      <div className="hhg-hh-adv-scan-container">
        
        {/* State 0: QR Code Scan */}
        {scanType === 0 && (
          <svg viewBox="0 0 100 100" className="hhg-hh-adv-svg">
            <g fill="none" stroke="#00FF88" strokeWidth="3">
              <rect x="20" y="20" width="20" height="20" />
              <rect x="60" y="20" width="20" height="20" />
              <rect x="20" y="60" width="20" height="20" />
              <rect x="65" y="65" width="10" height="10" />
              <path d="M 45 30 L 45 50 L 55 50" />
              <rect x="60" y="45" width="5" height="15" />
            </g>
            <line x1="10" y1="50" x2="90" y2="50" stroke="#FF1B8D" strokeWidth="2" className="hhg-hh-laser-scan" />
          </svg>
        )}

        {/* State 1: Face Scan */}
        {scanType === 1 && (
          <svg viewBox="0 0 100 100" className="hhg-hh-adv-svg">
            {/* Outline of a head */}
            <path d="M 50 15 C 30 15 25 30 25 45 C 25 60 35 70 35 85 L 65 85 C 65 70 75 60 75 45 C 75 30 70 15 50 15 Z" fill="none" stroke="#00FF88" strokeWidth="2" />
            {/* Grid lines over the face */}
            <path d="M 30 40 L 70 40 M 35 55 L 65 55 M 35 70 L 65 70 M 50 15 L 50 85" stroke="rgba(232, 200, 64, 0.4)" strokeWidth="1" />
            {/* Eyes */}
            <circle cx="40" cy="45" r="3" fill="#E8C840" className="hhg-hh-blink-fast" />
            <circle cx="60" cy="45" r="3" fill="#E8C840" className="hhg-hh-blink-fast" />
            <line x1="15" y1="15" x2="85" y2="15" stroke="#00FF88" strokeWidth="3" className="hhg-hh-laser-scan-vert" />
          </svg>
        )}

        {/* State 2: AI Robot */}
        {scanType === 2 && (
          <svg viewBox="0 0 100 100" className="hhg-hh-adv-svg">
            <rect x="30" y="25" width="40" height="50" rx="5" fill="none" stroke="#00FF88" strokeWidth="2" />
            <line x1="20" y1="45" x2="30" y2="45" stroke="#00FF88" strokeWidth="2" />
            <line x1="70" y1="45" x2="80" y2="45" stroke="#00FF88" strokeWidth="2" />
            <circle cx="50" cy="15" r="4" fill="#FF1B8D" className="hhg-hh-blink-slow" />
            <line x1="50" y1="15" x2="50" y2="25" stroke="#00FF88" strokeWidth="2" />
            {/* Robot Eyes */}
            <rect x="38" y="40" width="8" height="6" fill="#00FF88" className="hhg-hh-pulse-glow" />
            <rect x="54" y="40" width="8" height="6" fill="#00FF88" className="hhg-hh-pulse-glow" />
            {/* Mouth */}
            <line x1="42" y1="60" x2="58" y2="60" stroke="#00FF88" strokeWidth="2" strokeDasharray="2,2" />
          </svg>
        )}

        {/* State 3: Mainframe */}
        {scanType === 3 && (
          <svg viewBox="0 0 100 100" className="hhg-hh-adv-svg">
            <rect x="25" y="15" width="50" height="70" rx="3" fill="none" stroke="#00FF88" strokeWidth="2" />
            <rect x="30" y="25" width="40" height="10" fill="rgba(0,255,136,0.1)" stroke="#00FF88" strokeWidth="1" />
            <rect x="30" y="45" width="40" height="10" fill="rgba(0,255,136,0.1)" stroke="#00FF88" strokeWidth="1" />
            <rect x="30" y="65" width="40" height="10" fill="rgba(0,255,136,0.1)" stroke="#00FF88" strokeWidth="1" />
            {/* Blinking server lights */}
            <circle cx="35" cy="30" r="2" fill="#FF1B8D" className="hhg-hh-blink-fast" />
            <circle cx="45" cy="30" r="2" fill="#E8C840" className="hhg-hh-blink-slow" />
            
            <circle cx="35" cy="50" r="2" fill="#00FF88" className="hhg-hh-blink-fast" style={{animationDelay: '0.2s'}} />
            <circle cx="45" cy="50" r="2" fill="#00FF88" className="hhg-hh-blink-slow" style={{animationDelay: '0.4s'}} />
            
            <circle cx="35" cy="70" r="2" fill="#FF1B8D" className="hhg-hh-blink-slow" style={{animationDelay: '0.1s'}} />
            <circle cx="45" cy="70" r="2" fill="#E8C840" className="hhg-hh-blink-fast" style={{animationDelay: '0.5s'}} />
          </svg>
        )}
      </div>
    </div>
  );
}
