import QRCode from 'qrcode';
import JsBarcode from 'jsbarcode';


const COLORS = {
  greenDeep: '#0D3B1E',
  greenDark: '#102D18',
  greenMid: '#1A4A2E',
  greenLight: '#2D6B44',
  yellow: '#E8C840',
  yellowBright: '#F5D800',
  pink: '#FF1B8D',
  pinkDark: '#C4006A',
  pinkLight: '#FF6BB5',
  white: '#FFFFFF',
  black: '#0A0A0A',
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
    name: 'Neon Poster',
    emoji: '⚡',
    borderColor: '#00F0FF',
    accentColor: '#FF1B8D',
    bgStart: '#0A0A1A',
    bgEnd: '#050510',
    badgeStart: '#00F0FF',
    badgeEnd: '#0080FF',
    badgeBorder: '#00F0FF',
    graphics: [],
    glow: true
  },
  vintage: {
    name: 'Vintage Goa',
    emoji: '🌴',
    borderColor: '#2E7D32',
    accentColor: '#D84315',
    bgStart: '#F5E6C8',
    bgEnd: '#E8D5A3',
    badgeStart: '#1B5E20',
    badgeEnd: '#2E7D32',
    badgeBorder: '#E8C840',
    graphics: [],
    glow: false
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
  if (frameStyle === 'neon') {
    await drawNeonPosterIDCard(canvas, imageSrc, userData, cropData, qrUrl);
    return;
  }
  if (frameStyle === 'vintage') {
    await drawVintageGoaIDCard(canvas, imageSrc, userData, cropData, qrUrl);
    return;
  }

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

  // 3. Top Header Text (Removed as per user request)

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
  roundRect(photoX + 2, photoY + 2, photoSize - 4, photoSize - 4, 22, true, false);

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
    ctx.fillText(s, pillX + pillW / 2, pillY + 22);

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

  // 8. Barcode and Builder ID under the photo (y = 480 to 620)
  const barY = H - 180;
  const barX = 80;
  const barW = 340;

  ctx.fillStyle = tcSecondary;
  ctx.font = '700 12px "Space Mono", monospace';
  ctx.letterSpacing = '2px';
  ctx.textAlign = 'left';
  ctx.fillText('BUILDER ID', barX, barY + 15);
  ctx.letterSpacing = '0px';

  const badgeId = generateBadgeId(userData.name || '', userData.stack || '');
  ctx.fillStyle = tcPrimary;
  ctx.font = '700 16px "Space Mono", monospace';
  ctx.fillText('#HH-GOA-' + badgeId.replace('HHG26-', ''), barX, barY + 38);

  // Barcode lines
  ctx.fillStyle = isDarkTheme ? 'rgba(255, 255, 255, 0.85)' : 'rgba(0, 0, 0, 0.85)';
  let bx = barX;
  const barcodeHeight = 45;
  const barcodeY = barY + 52;
  let seedVal = 13;
  while (bx < barX + barW) {
    const bw = (seedVal % 5) + 1.5;
    seedVal = (seedVal * 7 + 3) % 23;
    ctx.fillRect(bx, barcodeY, bw, barcodeHeight);
    bx += bw + (seedVal % 4) + 1.5;
  }
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
  ctx.drawImage(img, cx, cy, cw, ch, x, y, w, h);
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

// ────────────────────────────────────────────
// Custom Neon Poster ID Card Renderer
// Builds entire poster from scratch — same as reference image
// ────────────────────────────────────────────
async function drawNeonPosterIDCard(canvas, imageSrc, userData, cropData, qrUrl) {
  const ctx = canvas.getContext('2d');
  const W = 1080;
  const H = 1540;
  canvas.width = W;
  canvas.height = H;

  const glow = (color, blur = 20) => { ctx.shadowColor = color; ctx.shadowBlur = blur; };
  const resetGlow = () => { ctx.shadowBlur = 0; ctx.shadowColor = 'transparent'; };
  const rr = (x, y, w, h, r) => {
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
  };

  // 1. BACKGROUND
  // Load the newly generated AI Goa vibe background!
  const bgPath = '/cyber_goa_bg.png';
  const bgImg = await new Promise((resolve) => {
    const i = new Image();
    i.crossOrigin = 'anonymous';
    i.onload = () => resolve(i);
    i.onerror = () => resolve(null);
    i.src = bgPath;
  });

  if (bgImg) {
    // Draw the stunning generated cyber goa background to cover the entire canvas
    ctx.drawImage(bgImg, 0, 0, W, H);
    
    // Add a slight dark glassmorphism overlay so the neon UI still pops beautifully!
    ctx.fillStyle = 'rgba(5, 12, 31, 0.6)';
    ctx.fillRect(0, 0, W, H);
  } else {
    // Fallback original background
    const bg = ctx.createRadialGradient(W / 2, H * 0.35, 0, W / 2, H * 0.5, H * 0.8);
    bg.addColorStop(0, '#0D1B3E');
    bg.addColorStop(0.5, '#050C1F');
    bg.addColorStop(1, '#020812');
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Stars
    const seed = 42;
    for (let i = 0; i < 180; i++) {
      const sx = ((i * 137 + seed) % W);
      const sy = ((i * 97 + seed) % (H * 0.7));
      const sr = (i % 3 === 0) ? 1.5 : 0.8;
      ctx.fillStyle = `rgba(255,255,255,${0.4 + (i % 5) * 0.1})`;
      ctx.beginPath(); ctx.arc(sx, sy, sr, 0, Math.PI * 2); ctx.fill();
    }

    // Subtle teal glow pool behind circle
    const pool = ctx.createRadialGradient(W / 2, 660, 0, W / 2, 660, 500);
    pool.addColorStop(0, 'rgba(0, 180, 200, 0.18)');
    pool.addColorStop(1, 'transparent');
    ctx.fillStyle = pool;
    ctx.fillRect(0, 0, W, H);
  }

  // 2. OUTER BORDER
  ctx.save();
  glow('#00F0FF', 12);
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 3;
  rr(16, 16, W - 32, H - 32, 24);
  ctx.stroke();
  resetGlow();

  // corner tech brackets
  const bk = (x, y, fx, fy) => {
    ctx.beginPath();
    ctx.moveTo(x + fx * 50, y);
    ctx.lineTo(x, y);
    ctx.lineTo(x, y + fy * 50);
    ctx.stroke();
  };
  ctx.lineWidth = 4;
  glow('#00F0FF', 14);
  bk(20, 20, 1, 1);
  bk(W - 20, 20, -1, 1);
  bk(20, H - 20, 1, -1);
  bk(W - 20, H - 20, -1, -1);
  resetGlow();
  ctx.restore();

  // 3. TOP DECORATIONS

  // GOA INDIA stamp (top-left)
  ctx.save();
  ctx.strokeStyle = '#4A8F6A';
  ctx.lineWidth = 4;
  rr(40, 40, 150, 110, 8);
  ctx.stroke();
  ctx.fillStyle = '#122A1A';
  rr(40, 40, 150, 110, 8);
  ctx.fill();
  ctx.fillStyle = '#1A4A2E';
  rr(48, 48, 134, 80, 4);
  ctx.fill();
  // sunset gradient in stamp
  const sunStamp = ctx.createLinearGradient(50, 60, 50, 120);
  sunStamp.addColorStop(0, '#1A6B3A');
  sunStamp.addColorStop(0.5, '#FF7B54');
  sunStamp.addColorStop(1, '#E8C840');
  ctx.fillStyle = sunStamp;
  ctx.fillRect(50, 50, 132, 76);
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  ctx.fillRect(100, 62, 4, 40);
  ctx.beginPath(); ctx.arc(102, 70, 16, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 13px "Unbounded", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('GOA', 115, 140);
  ctx.font = 'bold 10px "Space Mono", monospace';
  ctx.fillStyle = 'rgba(255,255,255,0.7)';
  ctx.fillText('INDIA', 115, 154);
  ctx.restore();

  // HH GOA 2026 pink badge (Removed as per user request)

  // BUILD IN GOA circular stamp (top-right)
  ctx.save();
  glow('#00F0FF', 8);
  ctx.strokeStyle = '#4A8F6A';
  ctx.lineWidth = 3;
  ctx.beginPath(); ctx.arc(W - 100, 100, 70, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(W - 100, 100, 58, 0, Math.PI * 2); ctx.stroke();
  resetGlow();
  ctx.fillStyle = '#1A6B3A';
  ctx.font = '22px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌴', W - 100, 108);
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.font = '700 9px "Space Mono", monospace';
  const circ = 'BUILD IN GOA · SHIP FROM PARADISE · ';
  const circArr = circ.split('');
  circArr.forEach((ch, i) => {
    const a = (i / circArr.length) * Math.PI * 2 - Math.PI / 2;
    ctx.save();
    ctx.translate(W - 100 + Math.cos(a) * 64, 100 + Math.sin(a) * 64);
    ctx.rotate(a + Math.PI / 2);
    ctx.fillText(ch, 0, 0);
    ctx.restore();
  });
  ctx.restore();

  // 4. TITLE
  ctx.save();
  ctx.textAlign = 'center';
  ctx.textBaseline = 'alphabetic';
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 70px "Unbounded", sans-serif';
  glow('#FFFFFF', 8);
  ctx.fillText('HACKER', W / 2 - 168, 218);
  resetGlow();
  ctx.fillStyle = '#FF1B8D';
  ctx.font = '900 68px serif';
  glow('#FF1B8D', 20);
  ctx.fillText('गोवा', W / 2 + 8, 218);
  resetGlow();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 70px "Unbounded", sans-serif';
  glow('#FFFFFF', 8);
  ctx.fillText('HOUSE', W / 2 + 210, 218);
  resetGlow();
  ctx.restore();

  // Subtitle
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(180,210,255,0.6)';
  ctx.font = '500 17px "Space Mono", monospace';
  ctx.fillText('CODE.  COLLABORATE.  CREATE HISTORY.', W / 2, 248);
  ctx.restore();

  // 5. LEFT SIDEBAR
  ctx.save();
  ctx.fillStyle = '#FF1B8D';
  ctx.font = '900 20px "Unbounded", sans-serif';
  ctx.save();
  ctx.translate(38, 490);
  ctx.rotate(-Math.PI / 2);
  glow('#FF1B8D', 10);
  ctx.textAlign = 'center';
  ctx.fillText('28 – 31  OCT  2026', 0, 0);
  resetGlow();
  ctx.restore();
  ctx.fillStyle = 'rgba(255,255,255,0.45)';
  ctx.font = '600 14px "Space Mono", monospace';
  ctx.save();
  ctx.translate(38, 700);
  ctx.rotate(-Math.PI / 2);
  ctx.textAlign = 'center';
  ctx.fillText('GOA  ·  INDIA', 0, 0);
  ctx.restore();
  ctx.restore();

  // BUILD / SHIP / REPEAT signs
  ctx.save();
  const signs = [
    { label: '⚓ BUILD', color: '#E8C840', y: 760 },
    { label: '🚢 SHIP', color: '#FF1B8D', y: 824 },
    { label: '🔁 REPEAT', color: '#00F0FF', y: 888 },
  ];
  signs.forEach(s => {
    ctx.fillStyle = s.color + '22';
    rr(42, s.y, 160, 44, 8);
    ctx.fill();
    glow(s.color, 10);
    ctx.strokeStyle = s.color;
    ctx.lineWidth = 2;
    rr(42, s.y, 160, 44, 8);
    ctx.stroke();
    resetGlow();
    ctx.fillStyle = '#FFFFFF';
    ctx.font = 'bold 17px "Unbounded", sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(s.label, 122, s.y + 28);
  });
  ctx.restore();

  // 6. RIGHT SIDE: LET'S BUILD badge
  ctx.save();
  ctx.fillStyle = '#E8C840';
  rr(W - 210, 460, 168, 94, 14);
  ctx.fill();
  ctx.fillStyle = '#000000';
  ctx.font = 'bold 28px "Unbounded", sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText("LET'S", W - 126, 510);
  ctx.fillText('BUILD!', W - 126, 544);
  ctx.restore();

  // 7. CENTER PHOTO CIRCLE
  const cx = W / 2;
  const cy = 650;
  const photoR = 306;

  // Outer glow rings
  ctx.save();
  for (let i = 3; i >= 1; i--) {
    ctx.strokeStyle = `rgba(0, 240, 255, ${0.07 * i})`;
    ctx.lineWidth = 3;
    ctx.beginPath(); ctx.arc(cx, cy, photoR + 28 + i * 18, 0, Math.PI * 2); ctx.stroke();
  }
  ctx.restore();

  // Clip & draw user photo
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, photoR, 0, Math.PI * 2);
  ctx.clip();
  const img = await loadImage(imageSrc);
  if (cropData) {
    drawCroppedImage(ctx, img, cropData, cx - photoR, cy - photoR, photoR * 2, photoR * 2);
  } else {
    drawCoveredImage(ctx, img, cx - photoR, cy - photoR, photoR * 2, photoR * 2);
  }
  ctx.restore();

  // Photo ring borders
  ctx.save();
  ctx.lineWidth = 16;
  ctx.strokeStyle = '#FF1B8D';
  glow('#FF1B8D', 30);
  ctx.beginPath(); ctx.arc(cx, cy, photoR + 8, 0, Math.PI * 2); ctx.stroke();
  ctx.lineWidth = 8;
  ctx.strokeStyle = '#00F0FF';
  glow('#00F0FF', 22);
  ctx.beginPath(); ctx.arc(cx, cy, photoR + 22, 0, Math.PI * 2); ctx.stroke();
  resetGlow();
  ctx.restore();

  // "BUILD · INNOVATE · IMPACT" arc text
  ctx.save();
  ctx.fillStyle = 'rgba(200,220,255,0.65)';
  ctx.font = '600 15px "Space Mono", monospace';
  ctx.textAlign = 'center';
  ctx.fillText('BUILD  ·  INNOVATE  ·  IMPACT', cx, cy - photoR - 32);
  ctx.restore();

  // 8. NAME BAR
  const nameBarY = cy + photoR + 28;

  // Tech connector dots
  ctx.save();
  glow('#00F0FF', 8);
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(cx - 340, nameBarY + 35);
  ctx.lineTo(cx - 240, nameBarY + 35);
  ctx.moveTo(cx + 240, nameBarY + 35);
  ctx.lineTo(cx + 340, nameBarY + 35);
  ctx.stroke();
  ctx.fillStyle = '#00F0FF';
  [-210, -192, -175].forEach(ox => { ctx.beginPath(); ctx.arc(cx + ox, nameBarY + 35, 4, 0, Math.PI * 2); ctx.fill(); });
  [175, 192, 210].forEach(ox => { ctx.beginPath(); ctx.arc(cx + ox, nameBarY + 35, 4, 0, Math.PI * 2); ctx.fill(); });
  resetGlow();
  ctx.restore();

  ctx.save();
  ctx.fillStyle = 'rgba(8, 16, 40, 0.92)';
  rr(cx - 340, nameBarY, 680, 70, 10);
  ctx.fill();
  glow('#00F0FF', 14);
  ctx.strokeStyle = '#00F0FF';
  ctx.lineWidth = 2;
  rr(cx - 340, nameBarY, 680, 70, 10);
  ctx.stroke();
  resetGlow();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 38px "Unbounded", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText((userData.name || 'BUILDER').toUpperCase(), cx, nameBarY + 35);
  ctx.restore();

  // Handle / Initials bar (yellow)
  const handleBarY = nameBarY + 88;
  ctx.save();
  ctx.fillStyle = '#E8C840';
  rr(cx - 240, handleBarY, 480, 56, 28);
  ctx.fill();
  ctx.fillStyle = '#C4006A';
  ctx.font = 'bold 20px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('⚡', cx - 175, handleBarY + 28);
  ctx.fillText('⚡', cx + 175, handleBarY + 28);
  ctx.fillStyle = '#0A0A0A';
  ctx.font = '900 24px "Unbounded", sans-serif';
  const initials = (userData.name || 'HH').split(' ').map(n => n[0] || '').join('').substring(0, 3).toUpperCase();
  ctx.fillText(initials, cx, handleBarY + 28);
  ctx.restore();

  // 9. BOTTOM 3 COLUMNS
  const bottomY = handleBarY + 80;
  const colW = W / 3;

  // Separator lines
  ctx.save();
  ctx.strokeStyle = 'rgba(0,240,255,0.25)';
  ctx.lineWidth = 1;
  ctx.setLineDash([6, 5]);
  [colW, colW * 2].forEach(x => {
    ctx.beginPath(); ctx.moveTo(x, bottomY); ctx.lineTo(x, H - 80); ctx.stroke();
  });
  ctx.setLineDash([]);
  ctx.restore();

  // LEFT COLUMN — BUILDER CLASS
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(180,210,255,0.75)';
  ctx.font = '700 14px "Space Mono", monospace';
  ctx.fillText('— BUILDER CLASS  >>', colW / 2, bottomY + 24);
  ctx.fillStyle = '#FF1B8D';
  glow('#FF1B8D', 14);
  ctx.font = '900 21px "Unbounded", sans-serif';
  const bClass = generateBuilderTitle(userData.name || '', userData.stack || '');
  const bWords = bClass.toUpperCase().split(' ');
  ctx.fillText(bWords[0] || 'TERMINAL', colW / 2, bottomY + 56);
  ctx.fillText(bWords[1] || 'WIZARD', colW / 2, bottomY + 82);
  resetGlow();
  ctx.restore();

  // QR Code
  const qrSize = 155;
  const qrX = Math.round(colW / 2 - qrSize / 2);
  const qrY = bottomY + 100;
  ctx.save();
  ctx.fillStyle = '#FFFFFF';
  rr(qrX - 6, qrY - 6, qrSize + 12, qrSize + 12, 8);
  ctx.fill();
  ctx.restore();
  await drawRealQRCode(ctx, qrX, qrY, qrSize, qrUrl || 'https://hhgoa.com');
  ctx.save();
  ctx.font = '16px serif';
  ctx.textAlign = 'center';
  ctx.fillText('🌴', qrX + qrSize / 2, qrY + qrSize - 18);
  ctx.restore();

  // CENTER COLUMN — BEACH BAG (Removed as per user request)
  ctx.save();
  ctx.restore();

  // RIGHT COLUMN — CURRENTLY SHIPPING
  ctx.save();
  ctx.textAlign = 'center';
  ctx.fillStyle = 'rgba(180,210,255,0.75)';
  ctx.font = '700 14px "Space Mono", monospace';
  ctx.fillText('— CURRENTLY SHIPPING  >>', colW * 2.5, bottomY + 24);
  ctx.fillStyle = '#FF1B8D';
  glow('#FF1B8D', 14);
  ctx.font = '900 22px "Unbounded", sans-serif';
  ctx.fillText('BUILDING', colW * 2.5, bottomY + 58);
  ctx.fillText('THE FUTURE', colW * 2.5, bottomY + 84);
  resetGlow();
  // Wavy line decoration
  ctx.strokeStyle = 'rgba(0,240,255,0.5)';
  ctx.lineWidth = 2;
  for (let wi = 0; wi < 2; wi++) {
    ctx.beginPath();
    const wy = bottomY + 102 + wi * 12;
    for (let wx = colW * 2 + 24; wx < W - 28; wx += 18) {
      const woff = Math.sin((wx / 18) * 0.9) * 5;
      if (wx === colW * 2 + 24) ctx.moveTo(wx, wy + woff);
      else ctx.lineTo(wx, wy + woff);
    }
    ctx.stroke();
  }
  // Builder ID
  ctx.fillStyle = 'rgba(200,220,255,0.65)';
  ctx.font = '700 13px "Space Mono", monospace';
  ctx.fillText('BUILDER ID', colW * 2.5, bottomY + 155);
  const bId = generateBadgeId(userData.name || '', userData.stack || '');
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '700 15px "Space Mono", monospace';
  ctx.fillText('#HH-GOA-' + bId.replace('HHG26-', ''), colW * 2.5, bottomY + 178);
  // Barcode
  ctx.fillStyle = '#FFFFFF';
  let bx2 = colW * 2 + 30;
  const barcodeY = bottomY + 198;
  let seedB = 13;
  while (bx2 < W - 30) {
    const bw = (seedB % 6) + 2;
    seedB = (seedB * 7 + 3) % 23;
    ctx.fillRect(bx2, barcodeY, bw, 48);
    bx2 += bw + (seedB % 5) + 2;
  }
  ctx.restore();

  // 10. BOTTOM SCENE
  ctx.save();
  const sunY2 = H - 140;
  const sunGrad2 = ctx.createLinearGradient(0, sunY2, 0, H - 80);
  sunGrad2.addColorStop(0, 'rgba(255,100,20,0.15)');
  sunGrad2.addColorStop(1, 'transparent');
  ctx.fillStyle = sunGrad2;
  ctx.fillRect(0, sunY2, W, H - 80 - sunY2);
  ctx.fillStyle = '#E8C840';
  glow('#E8C840', 22);
  ctx.beginPath(); ctx.arc(cx, sunY2 + 22, 26, 0, Math.PI * 2); ctx.fill();
  resetGlow();
  ctx.restore();

  // 11. FOOTER
  ctx.save();
  ctx.fillStyle = '#C4006A';
  rr(cx - 300, H - 68, 600, 56, 12);
  ctx.fill();
  glow('#FF1B8D', 22);
  ctx.strokeStyle = '#FF1B8D';
  ctx.lineWidth = 3;
  rr(cx - 300, H - 68, 600, 56, 12);
  ctx.stroke();
  resetGlow();
  ctx.fillStyle = '#FFFFFF';
  ctx.font = '900 26px "Unbounded", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('✦  #FRAMEINGOA  ✦', cx, H - 40);
  ctx.restore();
}

// ────────────────────────────────────────────
// Custom Vintage Goa ID Card Renderer
// Loads retro_poster_bg.png (which is vintage_id_bg.png) and draws dynamic user details on top
// ────────────────────────────────────────────
async function drawVintageGoaIDCard(canvas, imageSrc, userData, cropData, qrUrl) {
  const ctx = canvas.getContext('2d');
  const W = 1080;
  const H = 1440;
  canvas.width = W;
  canvas.height = H;

  // 1. Draw Vintage Poster template background
  const bgImg = await loadImage('/vintage_id_bg.png').catch(() => null);
  if (bgImg) {
    ctx.drawImage(bgImg, 0, 0, W, H);
  } else {
    ctx.fillStyle = '#F5E6C8';
    ctx.fillRect(0, 0, W, H);
  }

  const rr = (x, y, w, h, r) => {
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
  };

  // 2. Draw User Photo inside the middle rounded rect
  // Expanded by 8px in all directions to perfectly touch the template's inner yellow border
  const px = 233;
  const py = 409;
  const pw = 610;
  const ph = 436;
  const pr = 35;

  ctx.save();
  rr(px, py, pw, ph, pr);
  ctx.clip();

  const img = await loadImage(imageSrc);

  // Subtle professional portrait enhancement
  ctx.filter = 'brightness(1.05) contrast(1.05) saturate(1.1)';

  if (cropData) {
    const { x: cx, y: cy, width: cw, height: ch } = cropData;

    // 1. Draw a premium blurred background to seamlessly fill the wide 1.414 aspect ratio frame
    ctx.save();
    ctx.filter = 'blur(20px) brightness(0.6) saturate(1.2)';
    const destRatio = pw / ph;
    let bgSrcW = cw;
    let bgSrcH = cw / destRatio;
    let bgSrcY = cy + (ch - bgSrcH) / 2;
    // Fallback clamps for background
    if (bgSrcH > ch) bgSrcH = ch;
    if (bgSrcY < cy) bgSrcY = cy;
    ctx.drawImage(img, cx, bgSrcY, bgSrcW, bgSrcH, px, py, pw, ph);
    ctx.restore();

    // 2. Draw the exact cropped region (contain logic). No zoom outs, no cuts, no stretching!
    const scale = Math.min(pw / cw, ph / ch);
    const drawW = cw * scale;
    const drawH = ch * scale;
    const drawX = px + (pw - drawW) / 2;
    const drawY = py + (ph - drawH) / 2;

    // --- CREATIVE CYBER-GOA SIDE PANELS ---
    ctx.save();

    // Add a dark glassmorphism overlay on the blurred edges to make text pop
    ctx.fillStyle = 'rgba(11, 34, 19, 0.7)'; // Dark vintage green
    ctx.fillRect(px, py, drawX - px, ph); // Left blank
    ctx.fillRect(drawX + drawW, py, (px + pw) - (drawX + drawW), ph); // Right blank

    // Neon yellow accents
    const accentColor = '#E8C840';
    ctx.fillStyle = accentColor;
    ctx.strokeStyle = accentColor;
    ctx.lineWidth = 2;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';

    // Center coordinates for the side sections
    const leftMidX = px + (drawX - px) / 2;
    const rightMidX = drawX + drawW + ((px + pw) - (drawX + drawW)) / 2;

    // Tech lines framing the photo
    ctx.beginPath();
    ctx.moveTo(drawX - 1, py + 20);
    ctx.lineTo(drawX - 1, py + ph - 20);
    ctx.moveTo(drawX + drawW + 1, py + 20);
    ctx.lineTo(drawX + drawW + 1, py + ph - 20);
    ctx.stroke();

    // Left side: HACKER text & hash marks
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(leftMidX - 8, py + ph - 70 - i * 6, 16, 2);
    }
    ctx.save();
    ctx.translate(leftMidX, py + ph / 2 - 20);
    ctx.rotate(-Math.PI / 2);
    ctx.font = '800 16px "Space Mono", monospace';
    ctx.fillText('H A C K E R', 0, 0);
    ctx.restore();

    // Right side: BUILDER text & hash marks
    for (let i = 0; i < 6; i++) {
      ctx.fillRect(rightMidX - 8, py + 40 + i * 6, 16, 2);
    }
    ctx.save();
    ctx.translate(rightMidX, py + ph / 2 + 20);
    ctx.rotate(Math.PI / 2);
    ctx.font = '800 16px "Space Mono", monospace';
    ctx.fillText('B U I L D E R', 0, 0);
    ctx.restore();

    ctx.restore();
    // --- END SIDE PANELS ---

    ctx.drawImage(img, cx, cy, cw, ch, drawX, drawY, drawW, drawH);
  } else {
    drawCoveredImage(ctx, img, px, py, pw, ph);
  }

  ctx.filter = 'none';
  ctx.restore();

  // 3. Stylish Brush-Stroke Name Plate with 10-Character Wrapping limit
  ctx.save();
  const nameStr = (userData.name || 'BUILDER').toUpperCase().trim();

  const nameFontSize = 42;
  ctx.font = `900 ${nameFontSize}px "Unbounded", sans-serif`;
  
  // Custom wrapping: strict 10 character limit per line
  const maxChars = 10;
  let words = nameStr.split(' ').filter(w => w.length > 0);
  if (words.length === 0) words = ['BUILDER'];
  
  let tempLines = [];
  let currentLine = words[0];

  for (let i = 1; i < words.length; i++) {
    const word = words[i];
    if ((currentLine + " " + word).length <= maxChars) {
      currentLine += " " + word;
    } else {
      tempLines.push(currentLine);
      currentLine = word;
    }
  }
  tempLines.push(currentLine);

  let lines = [];
  for (let line of tempLines) {
    if (line.length > maxChars) {
      // Forcefully chunk words that are longer than 7 characters
      let temp = line;
      while (temp.length > maxChars) {
        lines.push(temp.substring(0, maxChars));
        temp = temp.substring(maxChars);
      }
      if (temp.length > 0) lines.push(temp);
    } else {
      lines.push(line);
    }
  }

  let maxLineWidth = Math.max(...lines.map(l => ctx.measureText(l).width));
  const plateW = Math.max(maxLineWidth + 120, 260); // Minimum 260px width
  const plateH = 36 + (lines.length * nameFontSize); // Dynamic height based on lines
  const plateX = (W / 2) - (plateW / 2);
  const plateY = 928 - (plateH / 2);

  const brushColor = '#0F4C5C'; // The dark teal from the screenshot

  ctx.fillStyle = brushColor;
  ctx.strokeStyle = brushColor;
  ctx.lineCap = 'round';
  ctx.lineJoin = 'round';

  // Base solid rect
  ctx.fillRect(plateX, plateY + 15, plateW, plateH - 30);

  // Frayed horizontal brush strokes to simulate a rough paint swipe
  const numStrokes = 70 + (lines.length * 20); // More strokes if taller
  for (let i = 0; i < numStrokes; i++) {
    let cy = plateY + (i / numStrokes) * plateH + (Math.random() - 0.5) * 4;
    let extLeft = Math.random() * 40;
    let extRight = Math.random() * 40;
    
    if (i % 6 === 0) {
      extLeft += 35;
      extRight += 35;
    }

    ctx.lineWidth = 2 + Math.random() * 7;
    ctx.beginPath();
    ctx.moveTo(plateX - extLeft, cy);
    ctx.lineTo(plateX + plateW + extRight, cy + (Math.random() - 0.5) * 6);
    ctx.stroke();
  }

  // Draw some yellow/orange accent splatters
  ctx.fillStyle = '#E8A340';
  ctx.beginPath();
  ctx.arc(plateX + plateW - 30, plateY + 15, 3.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(plateX + plateW - 20, plateY + 18, 2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(plateX + plateW - 38, plateY + 12, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Draw the actual name text
  ctx.fillStyle = '#FFFFFF';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Center all the lines vertically
  const totalTextHeight = lines.length * nameFontSize;
  let startY = 928 - (totalTextHeight / 2) + (nameFontSize / 2);

  for(let i=0; i<lines.length; i++) {
    ctx.fillText(lines[i], W / 2, startY + (i * nameFontSize));
  }
  
  ctx.restore();

  // 4. Role/Stack inside yellow pill
  ctx.save();
  const roleStr = (userData.stack || 'BUILDER').toUpperCase();
  ctx.fillStyle = '#0D3B1E';

  let roleFontSize = 20;
  ctx.font = `800 ${roleFontSize}px "Unbounded", sans-serif`;
  let roleWidth = ctx.measureText(roleStr).width;
  while (roleWidth > 420 && roleFontSize > 12) {
    roleFontSize -= 2;
    ctx.font = `800 ${roleFontSize}px "Unbounded", sans-serif`;
    roleWidth = ctx.measureText(roleStr).width;
  }

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(roleStr, W / 2, 1025); // Centered in yellow initials pill
  ctx.restore();

  // 5. Draw QR code perfectly centered in the 'SCAN QR' box
  const qrSz = 210; // Maximize size to fully fill the box
  
  // The 'SCAN QR' box center is approx X=245, Y=1205
  const qrCenter = 245;
  const qrCenterY = 1205; // Shifted down to center vertically inside the taller box
  
  const qrX = Math.round(qrCenter - qrSz / 2);
  const qrY = Math.round(qrCenterY - qrSz / 2); 
  
  await drawRealQRCode(ctx, qrX, qrY, qrSz, qrUrl || 'https://hhgoa.com');

  // 5.5 Fill in the middle "BEACH BAG" dotted lines (Removed as per request)
  
  // 6. Draw Barcode and ID perfectly centered in the 'BAR CODE' box
  const bId = generateBadgeId(userData.name || '', userData.stack || '');
  let barcodeValue = 'HH-GOA-' + bId.replace('HHG26-', '');
  
  // If the user provided a team name, encode both into the barcode!
  if (userData.team && userData.team.trim() !== '') {
    barcodeValue = userData.team.toUpperCase().trim() + ' | ' + barcodeValue;
  }

  ctx.save();
  ctx.fillStyle = '#000000'; // Changed to black as requested
  ctx.font = '700 22px "Space Mono", monospace';
  ctx.textAlign = 'center'; // Center the text over the barcode
  
  // The 'BAR CODE' box center is around 610
  const barCenter = 610;
  const barW = 360; // Target width
  const barStart = barCenter - (barW / 2); 
  const barcodeHeight = 65;
  const barcodeY = 1130; 
  
  // Create an offscreen canvas for the REAL barcode
  const barcodeCanvas = document.createElement('canvas');
  try {
    JsBarcode(barcodeCanvas, barcodeValue, {
      format: "CODE128",
      displayValue: false, // We draw the text manually below
      lineColor: "#000000",
      background: "transparent",
      width: 4, 
      height: barcodeHeight,
      margin: 0
    });
    
    // Draw the real barcode stretched to our desired width
    ctx.drawImage(
      barcodeCanvas, 
      0, 0, barcodeCanvas.width, barcodeCanvas.height,
      barStart, barcodeY, barW, barcodeHeight
    );
  } catch(e) {
    console.error("Barcode generation failed", e);
  }

  // Builder ID text (placed just below the barcode) - ONLY show the ID visually to prevent text overflow!
  const displayId = 'HH-GOA-' + bId.replace('HHG26-', '');
  ctx.fillText('#' + displayId, barCenter, 1220);

  // Conditionally render Team Name above the barcode if provided
  if (userData.team && userData.team.trim() !== '') {
    ctx.fillStyle = '#000000'; // Changed to black as well
    ctx.font = '700 16px "Space Mono", monospace';
    ctx.fillText('TEAM: ' + userData.team.toUpperCase(), barCenter, 1115);
  }
  ctx.restore();

  // 7. Draw ID Lanyard Hole at the top
  ctx.save();
  const holeW = 200;
  const holeH = 40;
  const holeX = (W / 2) - (holeW / 2);
  const holeY = 40; // Spacing from top edge
  const holeR = 20;

  ctx.beginPath();
  ctx.moveTo(holeX + holeR, holeY);
  ctx.lineTo(holeX + holeW - holeR, holeY);
  ctx.quadraticCurveTo(holeX + holeW, holeY, holeX + holeW, holeY + holeR);
  ctx.lineTo(holeX + holeW, holeY + holeH - holeR);
  ctx.quadraticCurveTo(holeX + holeW, holeY + holeH, holeX + holeW - holeR, holeY + holeH);
  ctx.lineTo(holeX + holeR, holeY + holeH);
  ctx.quadraticCurveTo(holeX, holeY + holeH, holeX, holeY + holeH - holeR);
  ctx.lineTo(holeX, holeY + holeR);
  ctx.quadraticCurveTo(holeX, holeY, holeX + holeR, holeY);
  ctx.closePath();

  // Punch out a transparent hole
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fill();

  // Draw a subtle 3D rim around the hole
  ctx.globalCompositeOperation = 'source-over';
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 3;
  ctx.stroke();
  
  // Inner highlight
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.restore();
}
