import React, { useState, useEffect } from 'react';
import './InteractiveBook.css';

const StylishClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours();
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();

  const hourDeg = (hours % 12) * 30 + minutes * 0.5;
  const minuteDeg = minutes * 6;
  const secondDeg = seconds * 6;

  const digitalHours = hours.toString().padStart(2, '0');
  const digitalMinutes = minutes.toString().padStart(2, '0');
  const digitalSeconds = seconds.toString().padStart(2, '0');

  return (
    <div className="hhg-clock-container">
      <div className="hhg-pendulum-clock">
        <div className="clock-top">
           <div className="clock-face">
             {[...Array(12)].map((_, i) => (
               <div key={i} className="clock-number" style={{ transform: `rotate(${(i + 1) * 30}deg)` }}>
                 <span style={{ transform: `rotate(${-(i + 1) * 30}deg)` }}>{i + 1}</span>
               </div>
             ))}
             <div className="hand hour-hand" style={{ transform: `rotate(${hourDeg}deg)` }}></div>
             <div className="hand minute-hand" style={{ transform: `rotate(${minuteDeg}deg)` }}></div>
             <div className="hand second-hand" style={{ transform: `rotate(${secondDeg}deg)` }}></div>
             <div className="center-dot"></div>
           </div>
        </div>
        <div className="clock-bottom">
           <div className="pendulum">
             <div className="pendulum-rod"></div>
             <div className="pendulum-bob"></div>
           </div>
        </div>
      </div>

      <div className="hhg-stylish-digital-clock">
        <div className="clock-time">
          <span>{digitalHours}</span>
          <span className="colon">:</span>
          <span>{digitalMinutes}</span>
          <span className="colon">:</span>
          <span className="seconds">{digitalSeconds}</span>
        </div>
        <div className="clock-date">
          {time.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }).toUpperCase()} // GOA, IN
        </div>
      </div>
    </div>
  );
};

export default function InteractiveBook({ step, children, onOpen, onClose }) {
  const [isOpen, setIsOpen] = useState(step > 0);
  const [touchStart, setTouchStart] = useState(null);

  useEffect(() => {
    if (step > 0) setIsOpen(true);
    else setIsOpen(false);
  }, [step]);

  // Lock body scroll when book is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  const handleCoverClick = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    if (!isOpen) {
      setIsOpen(true);
      if (onOpen) onOpen();
    }
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setIsOpen(false);
    if (onClose) onClose();
  };

  // Convert children to an array of pages
  const pages = React.Children.toArray(children);

  const handleTouchStart = (e) => {
    setTouchStart({ x: e.touches[0].clientX, y: e.touches[0].clientY });
  };
  
  const handleTouchEnd = (e) => {
    if (!touchStart || !isOpen) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const dx = touchStart.x - touchEndX;
    const dy = touchStart.y - touchEndY;
    const absDx = Math.abs(dx);
    const absDy = Math.abs(dy);
    
    if (absDx > absDy * 1.5 && absDx > 70) {
      // Horizontal Swipe
      if (dx > 0) {
        const nextBtn = document.querySelector('.hhg-active-page .hhg-book-page-front .btn-yellow:not(:disabled)');
        if (nextBtn) nextBtn.click();
      } else {
        const backBtn = document.querySelector('.hhg-active-page .hhg-book-page-front .btn-ghost');
        if (backBtn) backBtn.click();
      }
    }
    setTouchStart(null);
  };

  return (
    <div 
      className={`hhg-book-container ${isOpen ? 'is-fixed-overlay' : ''}`}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {isOpen && (
        <button className="hhg-book-close-btn" onClick={handleClose}>
          &times;
        </button>
      )}
      <div className={`hhg-book ${isOpen ? 'is-open' : 'is-closed'}`}>
        
        {/* Spine has been removed because the cover image is a 3D mockup that includes its own spine */}

        {/* Back Cover */}
        <div className="hhg-book-page hhg-book-back-cover" style={{ zIndex: 1, transform: 'translateZ(0px)' }}>
           <div className="hhg-book-page-front"></div>
           <div className="hhg-book-page-back"></div>
        </div>

        {/* Content Pages */}
        {pages.map((pageContent, index) => {
          const isFlipped = step > index + 1;
          const zIndex = isFlipped ? index + 10 : pages.length - index + 10;
          const translateZ = (pages.length - index) * 4; // 4px thickness per page
          const transform = isFlipped ? `rotateY(-180deg) translateZ(${translateZ}px)` : `rotateY(0deg) translateZ(${translateZ}px)`;

          return (
            <div 
              key={index} 
              className={`hhg-book-page hhg-book-content-page ${index === step - 1 ? 'hhg-active-page' : ''} ${isFlipped ? 'is-flipped' : ''}`}
              style={{ zIndex, transform }}
            >
              <div className="hhg-book-page-front">
                <div className="hhg-book-page-content">
                  {pageContent}
                </div>
              </div>
              <div className="hhg-book-page-back">
                <div className="hhg-book-page-content back-content">
                  <div className="hhg-logo-watermark">HH</div>
                  <div id={`left-page-${index}`} style={{ position: 'absolute', inset: 0, zIndex: 10 }} />
                </div>
              </div>
            </div>
          );
        })}

        {/* Global Navigation Arrows */}
        {isOpen && step > 1 && (
          <button 
            className="hhg-global-nav prev-arrow" 
            onClick={(e) => {
              e.stopPropagation();
              // Target the back button on the current active page (or the flipped page that just became back)
              // Actually, if we are on step 2, the left page is the BACK of step 1 (index 0).
              // The left page is index = step - 2.
              // But the Back button is rendered on the active page (index = step - 1) on the front.
              const backBtn = document.querySelector('.hhg-active-page .hhg-book-page-front .btn-ghost');
              if (backBtn) backBtn.click();
            }}
          >
            &#10094;
          </button>
        )}
        {isOpen && step > 0 && step < pages.length && (
          <button 
            className="hhg-global-nav next-arrow" 
            onClick={(e) => {
              e.stopPropagation();
              const nextBtn = document.querySelector('.hhg-active-page .hhg-book-page-front .btn-yellow:not(:disabled)');
              if (nextBtn) nextBtn.click();
            }}
          >
            &#10095;
          </button>
        )}

        <div 
          className="hhg-book-page hhg-book-front-cover"
          style={{ 
            zIndex: isOpen ? 5 : 50, 
            transform: isOpen ? `rotateY(-180deg) translateZ(${pages.length * 4 + 4}px)` : `rotateY(0deg) translateZ(${pages.length * 4 + 4}px)`,
            cursor: 'pointer'
          }}
          onClick={handleCoverClick}
        >
          <div 
            className="hhg-book-page-front cover-front"
            onClick={handleCoverClick}
          >
            <div className="cover-click-hint">
              <span className="pulse-icon">👆</span> CLICK TO OPEN
            </div>
          </div>
          <div className="hhg-book-page-back cover-back">
            <div className="cover-back-content">
              <h2>WELCOME TO HACKER HOUSE GOA</h2>
              <div className="divider"></div>
              <p className="manifesto">
                We are a community of builders, creators, and innovators. 
                <br/><br/>
                For one incredible week, we escape the noise, gather by the beach, and focus on what we do best: building the future.
              </p>
              
              <StylishClock />
              
              <div className="watermark">HH</div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
