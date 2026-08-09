import React, { useState, useEffect, useRef } from 'react';
import './ErrorTerminal.css';

export default function ErrorTerminal({ onClose }) {
  const [logs, setLogs] = useState([]);
  const endRef = useRef(null);

  const [trafficData, setTrafficData] = useState(Array.from({ length: 30 }, () => Math.random() * 100));
  const [cpuLoad, setCpuLoad] = useState(45);
  const [memLoad, setMemLoad] = useState(62);
  const [networkProgress, setNetworkProgress] = useState(78);
  const [threatProgress, setThreatProgress] = useState(12);

  // Simulated Live Data Updates
  useEffect(() => {
    const dataInterval = setInterval(() => {
      setTrafficData(prev => {
        const newData = [...prev.slice(1), Math.random() * 100];
        return newData;
      });
      setCpuLoad(prev => Math.max(10, Math.min(100, prev + (Math.random() * 20 - 10))));
      setMemLoad(prev => Math.max(20, Math.min(95, prev + (Math.random() * 10 - 5))));
      setNetworkProgress(prev => Math.max(40, Math.min(100, prev + (Math.random() * 10 - 5))));
      setThreatProgress(prev => Math.max(0, Math.min(100, prev + (Math.random() * 4 - 2))));
    }, 1500);

    return () => clearInterval(dataInterval);
  }, []);

  // Infinite Error Loop
  useEffect(() => {
    const errorScenarios = [
      {
        err: 'FATAL: Memory leak detected in core process 0x8F9A',
        solve: 'Allocating virtual memory... Patching pointer 0x8F9A... Success.'
      },
      {
        err: 'ERROR: Database connection timeout (Code 504)',
        solve: 'Rerouting connection through proxy server... DB handshake established.'
      },
      {
        err: 'CRITICAL: Unauthorized access attempt on port 22',
        solve: 'Deploying auto-firewall block on IP 192.168.1.5... Port secured.'
      },
      {
        err: 'WARNING: CPU core temperature exceeding 90C',
        solve: 'Throttling background tasks... Overriding fan control... Temp stabilized at 65C.'
      },
      {
        err: 'ERROR: Segment fault (core dumped) in graphics_engine.so',
        solve: 'Restarting graphics subsystem... Injecting safe-mode drivers... OK.'
      },
      {
        err: 'FATAL: SSL Certificate validation failed',
        solve: 'Fetching latest CA root certificates... Handshake verified.'
      },
      {
        err: 'CRITICAL: Data corruption in sector 7G',
        solve: 'Isolating sector 7G... Restoring data from Backup Node Beta... Data integrity 100%.'
      }
    ];

    let isRunning = true;

    const runErrorCycle = async () => {
      while (isRunning) {
        await new Promise(r => setTimeout(r, 1000 + Math.random() * 2000));
        if (!isRunning) break;

        const scenario = errorScenarios[Math.floor(Math.random() * errorScenarios.length)];
        
        setLogs(prev => [...prev.slice(-30), { type: 'err', text: `> ${scenario.err}` }]);

        await new Promise(r => setTimeout(r, 400 + Math.random() * 800));
        if (!isRunning) break;

        setLogs(prev => [...prev.slice(-30), { type: 'solve', text: `  Solving: ${scenario.solve}` }]);
      }
    };

    runErrorCycle();
    return () => { isRunning = false; };
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Helper for Circular Gauge
  const renderGauge = (val, label) => {
    const radius = 40;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (val / 100) * circumference;
    return (
      <div className="hhg-gauge">
        <svg className="hhg-gauge-svg" width="100" height="100">
          <circle cx="50" cy="50" r={radius} fill="none" stroke="#1E293B" strokeWidth="8" />
          <circle 
            cx="50" cy="50" r={radius} 
            fill="none" 
            stroke="#00FF88" 
            strokeWidth="8" 
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
          />
        </svg>
        <div className="hhg-gauge-value">{Math.round(val)}%</div>
        <div className="hhg-gauge-label">{label}</div>
      </div>
    );
  };

  return (
    <div className="hhg-err-terminal-overlay">
      <div className="hhg-dash-container">
        
        {/* Sidebar */}
        <div className="hhg-dash-sidebar">
          <div className="hhg-dash-avatar" />
          <div className="hhg-dash-icon active">⊞</div>
          <div className="hhg-dash-icon">⚲</div>
          <div className="hhg-dash-icon">⚡</div>
          <div className="hhg-dash-icon">🛡</div>
          <div className="hhg-dash-icon">⚙</div>
        </div>

        {/* Main Content */}
        <div className="hhg-dash-main">
          
          {/* Header */}
          <div className="hhg-dash-header">
            <div className="hhg-dash-title">Cyber_Command // Dashboard</div>
            <input type="text" className="hhg-dash-search" placeholder="Search logs, IPs, or domains..." />
            <button className="hhg-dash-close" onClick={onClose}>[ EXIT ]</button>
          </div>

          <div className="hhg-dash-grid">
            
            {/* Widget 1: Global Map */}
            <div className="hhg-dash-panel hhg-dash-map-widget">
              <div className="hhg-dash-panel-title">Threat Origin Map</div>
              <svg className="hhg-map-svg" viewBox="0 0 1000 500">
                {/* Simplified World Map shapes */}
                {/* North America */}
                <path d="M 150 50 L 300 40 L 350 150 L 250 220 L 120 150 Z" fill="#1E293B" stroke="#00FF88" strokeWidth="1" strokeOpacity="0.2" />
                {/* South America */}
                <path d="M 240 220 L 320 200 L 350 350 L 280 450 L 220 300 Z" fill="#1E293B" stroke="#00FF88" strokeWidth="1" strokeOpacity="0.2" />
                
                {/* Eurasia & Africa */}
                <path d="
                  M 450 50 
                  L 850 40 
                  L 950 150 
                  L 900 250 
                  L 780 200  
                  L 740 280  
                  L 690 190  
                  L 640 180  
                  L 600 220 
                  L 550 380  
                  L 450 300  
                  L 420 150 
                  Z" fill="#1E293B" stroke="#00FF88" strokeWidth="1" strokeOpacity="0.2" />
                
                {/* Australia */}
                <path d="M 850 350 L 950 330 L 980 400 L 880 450 Z" fill="#1E293B" stroke="#00FF88" strokeWidth="1" strokeOpacity="0.2" />

                {/* Animated Pulsing Dots */}
                {/* New York / East Coast */}
                <circle cx="280" cy="150" r="3" fill="#00FF88" />
                <circle cx="280" cy="150" className="hhg-map-dot" fill="none" />
                
                {/* London / Europe */}
                <circle cx="480" cy="100" r="3" fill="#00FF88" />
                <circle cx="480" cy="100" className="hhg-map-dot" fill="none" style={{ animationDelay: '0.5s' }} />

                {/* GOA, INDIA */}
                <g transform="translate(695, 230)">
                  <circle cx="0" cy="0" r="4" fill="#FF3333" />
                  <circle cx="0" cy="0" className="hhg-map-dot" fill="none" stroke="#FF3333" style={{ animationDelay: '1s' }} />
                  <text x="-10" y="15" fill="#00FF88" fontSize="12" fontWeight="bold" fontFamily="monospace">GOA</text>
                  {/* Crosshair target for Goa */}
                  <path d="M -8 0 L -3 0 M 8 0 L 3 0 M 0 -8 L 0 -3 M 0 8 L 0 3" stroke="#00FF88" strokeWidth="1" />
                </g>
                
                {/* Tokyo / Japan */}
                <circle cx="920" cy="140" r="3" fill="#00FF88" />
                <circle cx="920" cy="140" className="hhg-map-dot" fill="none" style={{ animationDelay: '1.5s' }} />
                
                {/* Connecting Lines to Goa */}
                <path d="M 280 150 Q 480 50 695 230" fill="none" stroke="rgba(0,255,136,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 480 100 Q 580 150 695 230" fill="none" stroke="rgba(0,255,136,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
                <path d="M 920 140 Q 850 180 695 230" fill="none" stroke="rgba(0,255,136,0.3)" strokeWidth="1.5" strokeDasharray="4 4" />
              </svg>
            </div>

            {/* Widget 2: Live Traffic Bar Chart */}
            <div className="hhg-dash-panel hhg-dash-traffic-widget">
              <div className="hhg-dash-panel-title">Network Traffic IO</div>
              <div className="hhg-traffic-chart">
                {trafficData.map((val, i) => (
                  <div 
                    key={i} 
                    className="hhg-traffic-bar" 
                    style={{ height: `${val}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Widget 3: Resource Gauges */}
            <div className="hhg-dash-panel hhg-dash-gauges-widget">
              {renderGauge(cpuLoad, "CPU LOAD")}
              {renderGauge(memLoad, "MEM USAGE")}
              
              {/* Linear Progress Bars */}
              <div style={{ flex: 1, paddingLeft: '30px' }}>
                <div className="hhg-progress-item">
                  <div className="hhg-progress-header">
                    <span>Network Stability</span>
                    <span>{Math.round(networkProgress)}%</span>
                  </div>
                  <div className="hhg-progress-track">
                    <div className="hhg-progress-fill" style={{ width: `${networkProgress}%` }} />
                  </div>
                </div>
                <div className="hhg-progress-item">
                  <div className="hhg-progress-header">
                    <span>Active Threats</span>
                    <span style={{ color: '#FF3333' }}>{Math.round(threatProgress)}%</span>
                  </div>
                  <div className="hhg-progress-track">
                    <div className="hhg-progress-fill" style={{ width: `${threatProgress}%`, background: '#FF3333', boxShadow: '0 0 10px #FF3333' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 4: Terminal Log */}
            <div className="hhg-dash-panel hhg-dash-term-widget">
              <div className="hhg-dash-panel-title">Active Security Log</div>
              <div className="hhg-dash-term-output">
                {logs.map((log, i) => (
                  <div key={i} className={`hhg-dash-log ${log.type}`}>
                    {log.text}
                  </div>
                ))}
                <div ref={endRef} />
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
