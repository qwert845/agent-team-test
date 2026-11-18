import { writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const assets = resolve(dirname(fileURLToPath(import.meta.url)), "../assets");

function crc32(bytes) {
  let crc = 0xffffffff;
  for (const byte of bytes) {
    crc ^= byte;
    for (let bit = 0; bit < 8; bit++) {
      crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0);
    }
  }
  return (crc ^ 0xffffffff) >>> 0;
}

function chunk(type, data) {
  const name = Buffer.from(type, "ascii");
  const length = Buffer.alloc(4);
  length.writeUInt32BE(data.length);
  const checksum = Buffer.alloc(4);
  checksum.writeUInt32BE(crc32(Buffer.concat([name, data])));
  return Buffer.concat([length, name, data, checksum]);
}

function png(width, height, pixels) {
  const header = Buffer.alloc(13);
  header.writeUInt32BE(width, 0);
  header.writeUInt32BE(height, 4);
  header[8] = 8; // 8 bits per channel
  header[9] = 6; // RGBA
  const scanlines = Buffer.alloc(height * (1 + width * 4));
  for (let y = 0; y < height; y++) {
    const start = y * (1 + width * 4);
    scanlines[start] = 0; // PNG filter: none
    pixels.copy(scanlines, start + 1, y * width * 4, (y + 1) * width * 4);
  }
  return Buffer.concat([
    Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]),
    chunk("IHDR", header),
    chunk("IDAT", deflateSync(scanlines, { level: 9 })),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function makeTarget() {
  const size = 64;
  const pixels = Buffer.alloc(size * size * 4);
  const samples = 8;
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      let alpha = 0;
      const color = [0, 0, 0];
      for (let sy = 0; sy < samples; sy++) {
        for (let sx = 0; sx < samples; sx++) {
          const dx = x + (sx + 0.5) / samples - 32;
          const dy = y + (sy + 0.5) / samples - 32;
          const radius = Math.hypot(dx, dy);
          if (radius >= 31.25) continue;
          // Red bullseye, then alternating white and red circular bands.
          const red = radius < 8.5 || (radius >= 15 && radius < 22) || radius >= 28.5;
          const shade = Math.round(5 * dy / 32);
          const band = red ? [216, 42, 54] : [247, 244, 236];
          for (let channel = 0; channel < 3; channel++) color[channel] += band[channel] - shade;
          alpha++;
        }
      }
      const offset = (y * size + x) * 4;
      if (alpha) {
        for (let channel = 0; channel < 3; channel++) pixels[offset + channel] = Math.round(color[channel] / alpha);
        pixels[offset + 3] = Math.round(alpha * 255 / (samples * samples));
      }
    }
  }
  return png(size, size, pixels);
}

function makeBackground() {
  const width = 640;
  const height = 360;
  const pixels = Buffer.alloc(width * height * 4);
  const top = [8, 17, 35];
  const bottom = [23, 43, 68];
  for (let y = 0; y < height; y++) {
    const t = y / (height - 1);
    for (let x = 0; x < width; x++) {
      const offset = (y * width + x) * 4;
      for (let channel = 0; channel < 3; channel++) {
        pixels[offset + channel] = Math.round(top[channel] * (1 - t) + bottom[channel] * t);
      }
      pixels[offset + 3] = 255;
    }
  }

  // A few fixed, quiet stars keep the background repeatable and subdued.
  const stars = [
    [35, 51, 0.8], [91, 137, 0.6], [139, 38, 0.9], [183, 199, 0.7],
    [218, 89, 0.6], [266, 153, 0.8], [309, 44, 0.6], [351, 211, 0.7],
    [397, 112, 0.9], [443, 56, 0.6], [481, 183, 0.7], [523, 126, 0.8],
    [568, 37, 0.6], [604, 218, 0.8],
  ];
  for (const [cx, cy, strength] of stars) {
    for (let y = Math.floor(cy - 2); y <= Math.ceil(cy + 2); y++) {
      for (let x = Math.floor(cx - 2); x <= Math.ceil(cx + 2); x++) {
        const distance = Math.hypot(x - cx, y - cy);
        const glow = strength * Math.max(0, 1 - distance / 2.2) * 0.5;
        const offset = (y * width + x) * 4;
        for (let channel = 0; channel < 3; channel++) {
          pixels[offset + channel] = Math.round(pixels[offset + channel] * (1 - glow) + 206 * glow);
        }
      }
    }
  }
  return png(width, height, pixels);
}

writeFileSync(resolve(assets, "target.png"), makeTarget());
writeFileSync(resolve(assets, "background.png"), makeBackground());
