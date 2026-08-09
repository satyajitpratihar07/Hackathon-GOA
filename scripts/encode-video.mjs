/**
 * Video optimizer for smooth browser playback.
 * Re-encodes cover.mp4 with:
 *  - 30→60 FPS optical-flow interpolation (minterpolate)
 *  - movflags faststart  (metadata at file front → instant play)
 *  - CRF 20 H.264  (good quality, fast hardware decode)
 *  - No audio track
 */

import { execFile } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root      = path.resolve(__dirname, '..');
const ffmpeg    = path.join(root, 'node_modules', 'ffmpeg-static', 'ffmpeg.exe');
const input     = path.join(root, 'public', 'cover.mp4');
const output    = path.join(root, 'public', 'cover_smooth.mp4');
const backup    = path.join(root, 'public', 'cover_original.mp4');

if (!fs.existsSync(ffmpeg)) {
  console.error('❌  ffmpeg-static binary not found at', ffmpeg);
  process.exit(1);
}

// Back up original
if (!fs.existsSync(backup)) {
  fs.copyFileSync(input, backup);
  console.log('📦  Backed up original → cover_original.mp4');
}

console.log('🎬  Starting video re-encode...');
console.log('    Input :', input);
console.log('    Output:', output);
console.log('    This will take ~1–3 minutes (optical-flow interpolation)...\n');

const args = [
  '-y',
  '-i', input,
  '-vf', [
    'minterpolate=fps=60:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=none',
    'unsharp=3:3:0.5:3:3:0.0'
  ].join(','),
  '-c:v', 'libx264',
  '-preset', 'slow',
  '-crf', '20',
  '-profile:v', 'high',
  '-level', '4.2',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-an',
  output
];

const start = Date.now();
const proc  = execFile(ffmpeg, args, { maxBuffer: 64 * 1024 * 1024 });

proc.stderr.on('data', (chunk) => {
  const line = chunk.toString();
  const m = line.match(/frame=\s*(\d+).*fps=\s*([\d.]+).*time=\s*([\d:]+)/);
  if (m) process.stdout.write(`\r    frame=${m[1].padStart(5)}  fps=${m[2].padStart(4)}  time=${m[3]}   `);
});

proc.on('close', (code) => {
  if (code !== 0) { console.error('\n❌  FFmpeg exited with code', code); process.exit(1); }
  const elapsed = ((Date.now() - start) / 1000).toFixed(1);
  const sizeMB  = (fs.statSync(output).size / 1024 / 1024).toFixed(1);
  console.log(`\n\n✅  Done in ${elapsed}s — Output: ${sizeMB} MB`);
  console.log('    Replacing cover.mp4 with smooth version...');
  fs.copyFileSync(output, input);
  fs.unlinkSync(output);
  console.log('🎉  cover.mp4 replaced! Refresh browser to see 60fps smooth playback.\n');
});
