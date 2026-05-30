#!/usr/bin/env node
// Generates a 512x512 PNG placeholder for the Raycast extension icon using only
// Node built-ins. The output is a solid Hexkit canvas color with a centered
// hex mark in the brand accent. Replace the file with a real logo any time.

import { writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { deflateSync } from "node:zlib";

const SIZE = 512;
const BG = [0x1a, 0x1b, 0x22]; // oklch(16% 0.008 265) ≈ #1a1b22
const FG = [0xef, 0x6c, 0x45]; // oklch(70% 0.18 33)  ≈ #ef6c45

function main() {
  const outDir = join(dirname(fileURLToPath(import.meta.url)), "..", "assets");
  mkdirSync(outDir, { recursive: true });

  const pixels = renderPixels();
  const png = encodePng(pixels, SIZE, SIZE);
  writeFileSync(join(outDir, "extension-icon.png"), png);
  console.log(`Wrote ${png.length} bytes to assets/extension-icon.png`);
}

function renderPixels() {
  const out = new Uint8Array(SIZE * SIZE * 3);
  // Hexagon vertices for a regular hex centered at (cx, cy) with radius r.
  const cx = SIZE / 2;
  const cy = SIZE / 2;
  const r = SIZE * 0.34;
  const verts = [];
  for (let i = 0; i < 6; i++) {
    const angle = (Math.PI / 3) * i - Math.PI / 2;
    verts.push([cx + r * Math.cos(angle), cy + r * Math.sin(angle)]);
  }

  for (let y = 0; y < SIZE; y++) {
    for (let x = 0; x < SIZE; x++) {
      const inside = pointInPolygon(x + 0.5, y + 0.5, verts);
      const [r0, g0, b0] = inside ? FG : BG;
      const idx = (y * SIZE + x) * 3;
      out[idx] = r0;
      out[idx + 1] = g0;
      out[idx + 2] = b0;
    }
  }
  return out;
}

function pointInPolygon(px, py, poly) {
  let inside = false;
  for (let i = 0, j = poly.length - 1; i < poly.length; j = i++) {
    const [xi, yi] = poly[i];
    const [xj, yj] = poly[j];
    const intersect =
      yi > py !== yj > py &&
      px < ((xj - xi) * (py - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

function encodePng(pixels, width, height) {
  const SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 2; // color type: truecolor RGB
  ihdr[10] = 0;
  ihdr[11] = 0;
  ihdr[12] = 0;

  // Each scanline is prefixed with a 1-byte filter type (0 = none).
  const stride = width * 3;
  const raw = Buffer.alloc(height * (stride + 1));
  for (let y = 0; y < height; y++) {
    raw[y * (stride + 1)] = 0;
    Buffer.from(pixels.buffer, y * stride, stride).copy(
      raw,
      y * (stride + 1) + 1,
    );
  }
  const idat = deflateSync(raw);

  return Buffer.concat([
    SIG,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}

const CRC_TABLE = (() => {
  const t = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    t[n] = c >>> 0;
  }
  return t;
})();

function crc32(buf) {
  let crc = 0xffffffff;
  for (let i = 0; i < buf.length; i++) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}

main();
