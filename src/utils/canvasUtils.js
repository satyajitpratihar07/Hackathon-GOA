import QRCode from 'qrcode';


const COLORS = {
  greenDeep:    '#0D3B1E',
  greenDark:    '#102D18',
  greenMid:     '#1A4A2E',
  greenLight:   '#2D6B44',
  yellow:       '#E8C840',
  yellowBright: '#F5D800',
  pink:         '#FF1B8D',
  pinkDark:     '#C4006A',
  pinkLight:    '#FF6BB5',
  white:        '#FFFFFF',
  black:        '#0A0A0A',
};

// ────────────────────────────────────────────
// Helpers
// ────────────────────────────────────────────

function hexToRgba(hex, alpha) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

function drawPalmTree(ctx, x, y, scale = 1, opacity = 0.18) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = COLORS.white;
  ctx.lineWidth = 3 * scale;
  ctx.lineCap = 'round';

  // trunk
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x + 10 * scale, y - 60 * scale, x - 10 * scale, y - 120 * scale, x + 15 * scale, y - 180 * scale);
  ctx.stroke();

  // fronds
  const frondData = [
    { ex: x + 80 * scale, ey: y - 220 * scale, cx: x + 50 * scale, cy: y - 180 * scale },
    { ex: x - 70 * scale, ey: y - 225 * scale, cx: x - 40 * scale, cy: y - 185 * scale },
    { ex: x + 50 * scale, ey: y - 260 * scale, cx: x + 30 * scale, cy: y - 215 * scale },
    { ex: x - 40 * scale, ey: y - 265 * scale, cx: x - 15 * scale, cy: y - 215 * scale },
    { ex: x + 10 * scale, ey: y - 280 * scale, cx: x + 15 * scale, cy: y - 235 * scale },
  ];
  frondData.forEach(f => {
    ctx.beginPath();
    ctx.moveTo(x + 15 * scale, y - 180 * scale);
    ctx.quadraticCurveTo(f.cx, f.cy, f.ex, f.ey);
    ctx.stroke();
  });
  ctx.restore();
}

function drawWaves(ctx, x, y, w, h, color = COLORS.white, opacity = 0.12) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2;
  ctx.lineCap = 'round';
  for (let i = 0; i < 3; i++) {
    const wy = y + i * 12;
    ctx.beginPath();
    for (let wx = x; wx < x + w; wx += 40) {
      ctx.moveTo(wx, wy);
      ctx.bezierCurveTo(wx + 10, wy - 6, wx + 20, wy + 6, wx + 40, wy);
    }
    ctx.stroke();
  }
  ctx.restore();
}

function drawSunburst(ctx, cx, cy, r, rays = 16, color = COLORS.yellow, opacity = 0.12) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  for (let i = 0; i < rays; i++) {
    const angle = (i / rays) * Math.PI * 2;
    const x1 = cx + Math.cos(angle) * r * 0.7;
    const y1 = cy + Math.sin(angle) * r * 0.7;
    const x2 = cx + Math.cos(angle) * r * 1.3;
    const y2 = cy + Math.sin(angle) * r * 1.3;
    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
  }
  ctx.restore();
}

function drawGrid(ctx, w, h, opacity = 0.03) {
  ctx.save();
  ctx.globalAlpha = opacity;
  ctx.strokeStyle = COLORS.yellow;
  ctx.lineWidth = 1;
  const step = 40;
  for (let x = 0; x < w; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  ctx.restore();
}

function drawTechGrid(ctx, w, h, color) {
  ctx.save();
  ctx.globalAlpha = 0.15;
  ctx.strokeStyle = color;
  ctx.lineWidth = 1.5;
  const step = 30;
  for (let x = 0; x < w; x += step) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke();
  }
  for (let y = 0; y < h; y += step) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke();
  }
  // Draw crosses at intersections
  ctx.globalAlpha = 0.4;
  for (let x = step; x < w; x += step * 2) {
    for (let y = step; y < h; y += step * 2) {
      ctx.beginPath(); ctx.moveTo(x - 4, y); ctx.lineTo(x + 4, y); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(x, y - 4); ctx.lineTo(x, y + 4); ctx.stroke();
    }
  }
  ctx.restore();
}

function drawScanlines(ctx, w, h, color) {
  ctx.save();
  ctx.globalAlpha = 0.05;
  ctx.fillStyle = color;
  for (let y = 0; y < h; y += 4) {
    ctx.fillRect(0, y, w, 1);
  }
  ctx.restore();
}

function drawElegantRings(ctx, cx, cy, radius, color) {
  ctx.save();
  ctx.strokeStyle = color;
  ctx.globalAlpha = 0.2;
  ctx.lineWidth = 1;
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath(); ctx.arc(cx, cy, radius + i * 40, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.globalAlpha = 0.05;
  ctx.lineWidth = 40;
  ctx.beginPath(); ctx.arc(cx, cy, radius + 100, 0, Math.PI * 2); ctx.stroke();
  ctx.restore();
}

// ────────────────────────────────────────────
// PFP Frame Renderer
// ────────────────────────────────────────────

export const FRAME_STYLES = {
  classic: {
    name: 'Classic',
    emoji: '🌴',
    borderColor: COLORS.yellow,
    accentColor: COLORS.pink,
    bgStart: '#1A4A2E',
    bgEnd: COLORS.greenDeep,
    badgeStart: COLORS.greenMid,
    badgeEnd: COLORS.greenLight,
    badgeBorder: COLORS.yellow,
    graphics: ['palmTrees', 'sunburst', 'waves'],
    glow: false
  },
  sunset: {
    name: 'Sunset',
    emoji: '🌅',
    borderColor: COLORS.pink,
    accentColor: COLORS.yellow,
    bgStart: '#FF7B54',
    bgEnd: '#1A0D2E',
    badgeStart: '#FF4E50',
    badgeEnd: '#F9D423',
    badgeBorder: COLORS.white,
    graphics: ['sunburst', 'waves'],
    glow: true
  },
  neon: {
    name: 'Neon',
    emoji: '⚡',
    borderColor: '#00FF88',
    accentColor: COLORS.pink,
    bgStart: '#0A2A1A',
    bgEnd: '#050E12',
    badgeStart: '#004422',
    badgeEnd: '#00FF88',
    badgeBorder: '#00FF88',
    graphics: ['grid', 'scanlines'],
    glow: true
  },
  beach: {
    name: 'Beach',
    emoji: '🏖️',
    borderColor: COLORS.yellow,
    accentColor: '#00BFFF',
    bgStart: '#1E90FF',
    bgEnd: '#0D2B3E',
    badgeStart: '#00BFFF',
    badgeEnd: '#0066CC',
    badgeBorder: COLORS.yellow,
    graphics: ['palmTrees', 'waves'],
    glow: false
  },
  hacker: {
    name: 'Hacker',
    emoji: '💻',
    borderColor: '#00FF88',
    accentColor: COLORS.yellow,
    bgStart: '#051A0F',
    bgEnd: '#020F08',
    badgeStart: '#0A2A1A',
    badgeEnd: '#051A0F',
    badgeBorder: '#00FF88',
    graphics: ['grid'],
    glow: true
  },
  royal: {
    name: 'Royal',
    emoji: '👑',
    borderColor: COLORS.yellowBright,
    accentColor: COLORS.pinkLight,
    bgStart: '#2A1A4A',
    bgEnd: '#110022',
    badgeStart: '#4A2A7A',
    badgeEnd: '#2A1A4A',
    badgeBorder: COLORS.yellowBright,
    graphics: ['elegantRings'],
    glow: false
  },
};

export async function drawPFPFrame(canvas, imageSrc, frameStyle = 'classic', cropData = null, shape = 'circle') {
  const ctx = canvas.getContext('2d');
  const SIZE = 1080;
  canvas.width = SIZE;
  canvas.height = SIZE;
  const style = FRAME_STYLES[frameStyle] || FRAME_STYLES.classic;
  const cx = SIZE / 2, cy = SIZE / 2;
  const photoR = SIZE * 0.31; // Reduced from 0.35 to give more breathing room
  const photoCy = cy - 40; // Move photo up further

  // Background
  const bgGrad = ctx.createRadialGradient(cx, cy * 0.6, 0, cx, cy, SIZE * 0.7);
  bgGrad.addColorStop(0, style.bgStart);
  bgGrad.addColorStop(1, style.bgEnd);
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, SIZE, SIZE);

  // Decorative graphics based on theme
  const hasGraphic = (g) => style.graphics && style.graphics.includes(g);
  
  if (hasGraphic('grid')) drawTechGrid(ctx, SIZE, SIZE, style.borderColor);
  if (hasGraphic('scanlines')) drawScanlines(ctx, SIZE, SIZE, style.borderColor);
  if (hasGraphic('sunburst')) drawSunburst(ctx, cx, photoCy, photoR + 120, 24, style.borderColor, 0.15);
  if (hasGraphic('elegantRings')) drawElegantRings(ctx, cx, photoCy, photoR, style.borderColor);

  // Decorative orbs
  const orb1 = ctx.createRadialGradient(cx * 0.3, SIZE * 0.2, 0, cx * 0.3, SIZE * 0.2, SIZE * 0.35);
  orb1.addColorStop(0, hexToRgba(style.borderColor, 0.12));
  orb1.addColorStop(1, 'transparent');
  ctx.fillStyle = orb1;
  ctx.fillRect(0, 0, SIZE, SIZE);

  const orb2 = ctx.createRadialGradient(cx * 1.7, SIZE * 0.8, 0, cx * 1.7, SIZE * 0.8, SIZE * 0.3);
  orb2.addColorStop(0, hexToRgba(style.accentColor, 0.12));
  orb2.addColorStop(1, 'transparent');
  ctx.fillStyle = orb2;
  ctx.fillRect(0, 0, SIZE, SIZE);

  if (hasGraphic('palmTrees')) {
    drawPalmTree(ctx, 120, SIZE - 100, 1.2, 0.25);
    drawPalmTree(ctx, SIZE - 120, SIZE - 80, 1.0, 0.20);
  }
  
  if (hasGraphic('waves')) {
    drawWaves(ctx, 0, SIZE * 0.88, SIZE, 40, COLORS.white, 0.12);
  }

  // Photo
  const img = await loadImage(imageSrc);

  ctx.save();
  if (shape === 'circle') {
    ctx.beginPath();
    ctx.arc(cx, photoCy, photoR, 0, Math.PI * 2);
    ctx.clip();
  } else {
    const photoSize = photoR * 2;
    drawRoundedRect(ctx, cx - photoR, photoCy - photoR, photoSize, photoSize, 24);
    ctx.clip();
  }

  if (cropData) {
    drawCroppedImage(ctx, img, cropData, cx - photoR, photoCy - photoR, photoR * 2, photoR * 2);
  } else {
    drawCoveredImage(ctx, img, cx - photoR, photoCy - photoR, photoR * 2, photoR * 2);
  }
  ctx.restore();

  // Photo Borders
  ctx.strokeStyle = style.borderColor;
  ctx.lineWidth = 6;
  if (style.glow) {
    ctx.shadowColor = style.borderColor;
    ctx.shadowBlur = 20;
  }
  if (shape === 'circle') {
    ctx.beginPath(); ctx.arc(cx, photoCy, photoR + 2, 0, Math.PI * 2); ctx.stroke();
  } else {
    drawRoundedRect(ctx, cx - photoR - 2, photoCy - photoR - 2, (photoR + 2) * 2, (photoR + 2) * 2, 26);
    ctx.stroke();
  }
  ctx.shadowBlur = 0; // reset glow

  // Text Arc
  ctx.save();
  ctx.font = `700 ${SIZE * 0.028}px 'Space Mono', monospace`;
  ctx.fillStyle = style.borderColor;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if (style.glow) {
    ctx.shadowColor = style.borderColor;
    ctx.shadowBlur = 10;
  }
  const arcR = photoR + 70;
  const arcText = '✦  HACKER HOUSE  GOA  2026  ✦  HACKER HOUSE  GOA  2026';
  const totalLen = arcText.length;
  const angleStep = (Math.PI * 2) / totalLen;
  const startAngle = -Math.PI / 2;
  for (let i = 0; i < totalLen; i++) {
    const angle = startAngle + i * angleStep;
    ctx.save();
    ctx.translate(cx + Math.cos(angle) * arcR, photoCy + Math.sin(angle) * arcR);
    ctx.rotate(angle + Math.PI / 2);
    ctx.fillText(arcText[i], 0, 0);
    ctx.restore();
  }
  ctx.restore();

  // Bottom Badge
  const barY = SIZE * 0.83; // Moved up slightly
  const barH = SIZE * 0.12;
  const barW = SIZE * 0.72;
  const barX = cx - barW / 2;

  ctx.save();
  drawRoundedRect(ctx, barX, barY, barW, barH, 20);
  const barGrad = ctx.createLinearGradient(barX, barY, barX + barW, barY + barH);
  barGrad.addColorStop(0, style.badgeStart);
  barGrad.addColorStop(1, style.badgeEnd);
  ctx.fillStyle = barGrad;
  if (style.glow) {
    ctx.shadowColor = style.badgeBorder;
    ctx.shadowBlur = 15;
  }
  ctx.fill();
  ctx.strokeStyle = hexToRgba(style.badgeBorder, 0.6);
  ctx.lineWidth = 3;
  ctx.stroke();
  ctx.restore();

  ctx.font = `900 ${barH * 0.44}px 'Unbounded', sans-serif`;
  ctx.fillStyle = style.badgeBorder === COLORS.white ? '#000000' : style.badgeBorder;
  ctx.textAlign = 'center';
  ctx.fillText('HACKER HOUSE', cx, barY + barH * 0.46);
  ctx.font = `700 ${barH * 0.3}px 'Unbounded', sans-serif`;
  ctx.fillStyle = style.accentColor;
  ctx.fillText('GOA 2026', cx, barY + barH * 0.82);

  ctx.font = `700 ${SIZE * 0.022}px 'Space Mono', monospace`;
  ctx.fillStyle = hexToRgba(COLORS.white, 0.6);
  ctx.textAlign = 'center';
  ctx.fillText('#FrameInGoa  ·  28–31 OCT 2026  ·  GOA, INDIA', cx, SIZE - 30);
}

// ────────────────────────────────────────────
// Procedural QR Code Drawing Function (Real Scannable QR)
// ────────────────────────────────────────────
async function drawRealQRCode(ctx, x, y, size, dataString) {
  try {
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = size;
    tempCanvas.height = size;
    
    // Draw QR Code in black on white background
    await QRCode.toCanvas(tempCanvas, dataString, {
      margin: 2,
      width: size,
      errorCorrectionLevel: 'L',
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    });

    const tempCtx = tempCanvas.getContext('2d');
    
    // Use 'screen' or 'lighten' to dye the black pixels into the gradient!
    // Black + Purple = Purple. White + Purple = White.
    tempCtx.globalCompositeOperation = 'screen';
    const grad = tempCtx.createLinearGradient(0, 0, 0, size);
    grad.addColorStop(0, '#5D3FD3'); // Vibrant purple top
    grad.addColorStop(1, '#0F0518'); // Very dark purple bottom
    tempCtx.fillStyle = grad;
    tempCtx.fillRect(0, 0, size, size);
    tempCtx.globalCompositeOperation = 'source-over';

    // Draw white background on the main canvas
    ctx.fillStyle = '#FFFFFF';
    ctx.beginPath();
    const r = 8;
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + size - r, y);
    ctx.quadraticCurveTo(x + size, y, x + size, y + r);
    ctx.lineTo(x + size, y + size - r);
    ctx.quadraticCurveTo(x + size, y + size, x + size - r, y + size);
    ctx.lineTo(x + r, y + size);
    ctx.quadraticCurveTo(x, y + size, x, y + size - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.fill();

    // Draw the gradient QR code
    ctx.drawImage(tempCanvas, x, y, size, size);
  } catch (err) {
    console.error('Failed to draw real QR Code:', err);
    ctx.fillStyle = '#FFFFFF';
    ctx.fillRect(x, y, size, size);
  }
}

// ────────────────────────────────────────────
// Builder ID Card Renderer (High-Fidelity Event Badge)
// ────────────────────────────────────────────

export const BUILDER_TITLES = [
  'Midnight Coder', 'Terminal Wizard', 'Ship It Sensei', 'Protocol Pirate',
  'Hack God', 'Kernel Surfer', 'Stack Alchemist', 'Zero-Day Surfer',
  'Web3 Wanderer', 'Byte Bender', 'Lambda Lord', 'Vibe Architect',
  'Sand & Code', 'Ocean Dev', 'Goa Shipper', 'Backspace Samurai',
];

export function generateBuilderTitle(name, stack) {
  const seed = (name + stack).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return BUILDER_TITLES[seed % BUILDER_TITLES.length];
}

export function generateBadgeId(name, stack) {
  const seed = (name + stack).split('').reduce((a, c) => a + c.charCodeAt(0), 0);
  return `HHG26-${1000 + (seed % 9000)}`;
}

export async function drawIDCard(canvas, imageSrc, userData, frameStyle = 'classic', cropData = null, qrUrl = null) {
  const ctx = canvas.getContext('2d');
  const W = 1080;
  const H = 680;
  canvas.width = W;
  canvas.height = H;

  const backgrounds = {
    sunset: '/sunset_id_bg.png',
    classic: '/classic_id_bg.png',
    neon: '/neon_id_bg.png',
    beach: '/beach_id_bg.png',
    hacker: '/hacker_id_bg.png',
    royal: '/royal_id_bg.png'
  };
  
  const bgPath = backgrounds[frameStyle] || backgrounds.sunset;
  const bgImg = await loadImage(bgPath).catch(() => null);
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, W, H);
  } else {
    // Fallback gradient if missing
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0, '#f9a826');
    grad.addColorStop(1, '#e94e77');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);
  }

  // Helper for drawing rounded rects
  const roundRect = (x, y, w, h, r, stroke = false, fill = true) => {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.lineTo(x + w - r, y);
    ctx.quadraticCurveTo(x + w, y, x + w, y + r);
    ctx.lineTo(x + w, y + h - r);
    ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    ctx.lineTo(x + r, y + h);
    ctx.quadraticCurveTo(x, y + h, x, y + h - r);
    ctx.lineTo(x, y + r);
    ctx.quadraticCurveTo(x, y, x + r, y);
    ctx.closePath();
    if (fill) ctx.fill();
    if (stroke) ctx.stroke();
  };

  const isDarkTheme = ['neon', 'hacker', 'royal'].includes(frameStyle);
  const tcPrimary = isDarkTheme ? 'rgba(255,255,255,0.95)' : 'rgba(0,0,0,0.9)';
  const tcSecondary = isDarkTheme ? 'rgba(255,255,255,0.8)' : 'rgba(0,0,0,0.8)';
  const tcTertiary = isDarkTheme ? 'rgba(255,255,255,0.6)' : 'rgba(0,0,0,0.6)';

  // 3. Top Header Text
  ctx.fillStyle = tcTertiary;
  ctx.font = '700 16px "Unbounded", sans-serif';
  ctx.textAlign = 'left';
  ctx.letterSpacing = '3px';
  ctx.fillText('PREMIUM BUILDER IDENTITY CARD', 80, 70);
  ctx.letterSpacing = '0px';

  // 4. Profile Photo (Left Side)
  const photoSize = 340;
  const photoX = 80;
  const photoY = 120;
  
  // Subtle glowing outer stroke
  ctx.save();
  ctx.shadowColor = 'rgba(255, 255, 255, 0.8)';
  ctx.shadowBlur = 20;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.lineWidth = 4;
  roundRect(photoX, photoY, photoSize, photoSize, 24, true, false);
  ctx.restore();

  // Photo clipping
  const img = await loadImage(imageSrc);
  ctx.save();
  roundRect(photoX, photoY, photoSize, photoSize, 24);
  ctx.clip();
  if (cropData) {
    drawCroppedImage(ctx, img, cropData, photoX, photoY, photoSize, photoSize);
  } else {
    drawCoveredImage(ctx, img, photoX, photoY, photoSize, photoSize);
  }
  ctx.restore();

  // Inner inset stroke
  ctx.strokeStyle = 'rgba(255,215,0,0.6)';
  ctx.lineWidth = 2;
  roundRect(photoX+2, photoY+2, photoSize-4, photoSize-4, 22, true, false);

  // 5. Typography on Right Side
  const textX = photoX + photoSize + 50;
  let textY = photoY + 30;

  // Event Title
  ctx.fillStyle = tcSecondary;
  ctx.font = '700 16px "Unbounded", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('HACKER HOUSE GOA 2026', textX, textY);
  ctx.letterSpacing = '0px';

  // Name
  textY += 45;
  ctx.fillStyle = tcPrimary;
  ctx.font = '900 42px "Unbounded", sans-serif';
  const nameText = (userData.name || 'GOA BUILDER').toUpperCase();
  ctx.fillText(nameText, textX, textY);

  // X / Twitter Handle
  if (userData.handle) {
    textY += 35;
    ctx.fillStyle = tcSecondary;
    ctx.font = '600 24px "Space Mono", monospace';
    const handleText = userData.handle.startsWith('@') ? userData.handle : `@${userData.handle}`;
    ctx.fillText(handleText, textX, textY);
  }

  // Team Name
  if (userData.team) {
    textY += 35;
    ctx.fillStyle = tcTertiary;
    ctx.font = '500 20px "Unbounded", sans-serif';
    ctx.fillText(`TEAM: ${userData.team.toUpperCase()}`, textX, textY);
  }

  // Subtitle (Builder Title) removed

  // ROLE section removed to prevent fake data

  // TECH STACK Label (Dynamic Spacing)
  textY += 50;
  ctx.fillStyle = tcSecondary;
  ctx.font = '700 14px "Unbounded", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('TECH STACK / ROLE', textX, textY);
  ctx.letterSpacing = '0px';

  // TECH STACK Pills
  textY += 15;
  const stacks = (userData.stack || 'REACT, NEXT.JS').split(/[,|]/).map(s => s.trim().toUpperCase()).slice(0, 4);
  if (stacks.length === 0) stacks.push('DEV');
  
  let pillX = textX;
  const pillY = textY;
  const pillH = 34;
  ctx.font = '700 14px "Space Mono", monospace';
  
  stacks.forEach(s => {
    const textWidth = ctx.measureText(s).width;
    const pillW = textWidth + 30;
    
    // Pill background
    ctx.fillStyle = 'rgba(15, 23, 42, 0.7)'; // Dark slate
    roundRect(pillX, pillY, pillW, pillH, 17, false, true);
    // Pill text
    ctx.fillStyle = '#FFF';
    ctx.textAlign = 'center';
    ctx.fillText(s, pillX + pillW/2, pillY + 22);
    
    pillX += pillW + 12;
  });
  ctx.textAlign = 'left'; // reset

  // 6. QR Code Bottom Right
  const qrSize = 220;
  const qrX = W - 410;
  const qrY = H - 270;
  const qrDataStr = qrUrl || `https://hhgoa.com/pass?u=${encodeURIComponent(userData.name || 'builder')}`;
  
  // Draw subtle dark background for QR for contrast
  ctx.fillStyle = 'rgba(15, 23, 42, 0.7)';
  roundRect(qrX - 5, qrY - 5, qrSize + 10, qrSize + 10, 12, false, true);
  await drawRealQRCode(ctx, qrX, qrY, qrSize, qrDataStr);

  // 7. Hexagon Logo Bottom Right
  const hexRadius = 50;
  const hexX = W - 100;
  const hexY = H - 100;

  // Draw Hexagon
  ctx.save();
  ctx.beginPath();
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    const hx = hexX + hexRadius * Math.cos(angle);
    const hy = hexY + hexRadius * Math.sin(angle);
    if (i === 0) ctx.moveTo(hx, hy);
    else ctx.lineTo(hx, hy);
  }
  ctx.closePath();
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)'; // Dark slate
  ctx.shadowColor = 'rgba(0, 240, 255, 0.5)';
  ctx.shadowBlur = 15;
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 240, 255, 0.8)'; // Cyan border
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.restore();

  // Inside Hexagon Text
  ctx.fillStyle = '#E8C840';
  ctx.textAlign = 'center';
  ctx.font = '900 32px "Unbounded", sans-serif';
  ctx.fillText('HH', hexX, hexY + 5);
  ctx.fillStyle = '#FFF';
  ctx.font = '700 14px "Unbounded", sans-serif';
  ctx.fillText('GOA', hexX, hexY + 26);
}

// ────────────────────────────────────────────
// Image helpers
// ────────────────────────────────────────────

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawCoveredImage(ctx, img, x, y, w, h) {
  const imgAR = img.naturalWidth / img.naturalHeight;
  const boxAR = w / h;
  let sx, sy, sw, sh;
  if (imgAR > boxAR) {
    sh = img.naturalHeight;
    sw = sh * boxAR;
    sx = (img.naturalWidth - sw) / 2;
    sy = 0;
  } else {
    sw = img.naturalWidth;
    sh = sw / boxAR;
    sx = 0;
    sy = (img.naturalHeight - sh) / 2;
  }
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

function drawCroppedImage(ctx, img, cropData, x, y, w, h) {
  const { x: cx, y: cy, width: cw, height: ch } = cropData;
  const naturalW = img.naturalWidth;
  const naturalH = img.naturalHeight;
  const sx = (cx / 100) * naturalW;
  const sy = (cy / 100) * naturalH;
  const sw = (cw / 100) * naturalW;
  const sh = (ch / 100) * naturalH;
  ctx.drawImage(img, sx, sy, sw, sh, x, y, w, h);
}

export function canvasToPNGBlob(canvas) {
  return new Promise(resolve => canvas.toBlob(resolve, 'image/png'));
}

export function downloadCanvas(canvas, filename = 'hhgoa-frame.png') {
  const url = canvas.toDataURL('image/png');
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
}
