// Lightweight, dependency-free ISO/IEC 18004 QR Code matrix generator (Byte mode, ECC Level L)

const GF_EXP = new Uint8Array(512);
const GF_LOG = new Uint8Array(256);

(() => {
  let x = 1;
  for (let i = 0; i < 255; i++) {
    GF_EXP[i] = x;
    GF_LOG[x] = i;
    x <<= 1;
    if (x & 0x100) x ^= 0x11d;
  }
  for (let i = 255; i < 512; i++) {
    GF_EXP[i] = GF_EXP[i - 255];
  }
})();

function gfMul(a, b) {
  if (a === 0 || b === 0) return 0;
  return GF_EXP[GF_LOG[a] + GF_LOG[b]];
}

function getGeneratorPoly(ecCount) {
  let poly = [1];
  for (let i = 0; i < ecCount; i++) {
    const next = new Array(poly.length + 1).fill(0);
    const root = GF_EXP[i];
    for (let j = 0; j < poly.length; j++) {
      next[j] ^= poly[j];
      next[j + 1] ^= gfMul(poly[j], root);
    }
    poly = next;
  }
  return poly;
}

function computeEC(data, ecCount) {
  const gen = getGeneratorPoly(ecCount);
  const res = new Uint8Array(data.length + ecCount);
  res.set(data);
  for (let i = 0; i < data.length; i++) {
    const coef = res[i];
    if (coef !== 0) {
      for (let j = 0; j < gen.length; j++) {
        res[i + j] ^= gfMul(gen[j], coef);
      }
    }
  }
  return res.slice(data.length);
}

// Version specs for ECC Level L (single block versions 1-5)
const VERSION_SPECS = [
  { version: 1, size: 21, totalCodewords: 26, dataCodewords: 19, ecCodewords: 7, align: [] },
  { version: 2, size: 25, totalCodewords: 44, dataCodewords: 34, ecCodewords: 10, align: [6, 18] },
  { version: 3, size: 29, totalCodewords: 70, dataCodewords: 55, ecCodewords: 15, align: [6, 22] },
  { version: 4, size: 33, totalCodewords: 100, dataCodewords: 80, ecCodewords: 20, align: [6, 26] },
  { version: 5, size: 37, totalCodewords: 134, dataCodewords: 108, ecCodewords: 26, align: [6, 30] }
];

function encodeByteData(text) {
  const bytes = new TextEncoder().encode(text);
  const spec =
    VERSION_SPECS.find((s) => bytes.length + 2 <= s.dataCodewords) ||
    VERSION_SPECS[VERSION_SPECS.length - 1];
  const clipped = bytes.slice(0, spec.dataCodewords - 2);

  const bits = [];
  const pushBits = (val, len) => {
    for (let i = len - 1; i >= 0; i--) {
      bits.push((val >> i) & 1);
    }
  };

  // Mode: Byte (0100)
  pushBits(0b0100, 4);
  // Character count (8 bits for versions 1-9)
  pushBits(clipped.length, 8);
  for (const b of clipped) pushBits(b, 8);

  const maxBits = spec.dataCodewords * 8;
  // Terminator
  for (let i = 0; i < 4 && bits.length < maxBits; i++) bits.push(0);
  while (bits.length % 8 !== 0) bits.push(0);

  const codewords = [];
  for (let i = 0; i < bits.length; i += 8) {
    let val = 0;
    for (let j = 0; j < 8; j++) val = (val << 1) | bits[i + j];
    codewords.push(val);
  }

  let padToggle = true;
  while (codewords.length < spec.dataCodewords) {
    codewords.push(padToggle ? 0xec : 0x11);
    padToggle = !padToggle;
  }

  const ec = computeEC(new Uint8Array(codewords), spec.ecCodewords);
  const finalCodewords = [...codewords, ...ec];
  return { spec, finalCodewords };
}

function buildMatrix(spec, finalCodewords) {
  const n = spec.size;
  const grid = Array.from({ length: n }, () => new Array(n).fill(null));
  const reserved = Array.from({ length: n }, () => new Array(n).fill(false));

  const setModule = (r, c, val, isReserved = true) => {
    if (r < 0 || r >= n || c < 0 || c >= n) return;
    grid[r][c] = val;
    if (isReserved) reserved[r][c] = true;
  };

  const placeFinder = (top, left) => {
    for (let r = -1; r <= 7; r++) {
      for (let c = -1; c <= 7; c++) {
        const rr = top + r;
        const cc = left + c;
        if (rr < 0 || rr >= n || cc < 0 || cc >= n) continue;
        const inOuter = r >= 0 && r <= 6 && c >= 0 && c <= 6;
        const onBorder = r === 0 || r === 6 || c === 0 || c === 6;
        const inCenter = r >= 2 && r <= 4 && c >= 2 && c <= 4;
        setModule(rr, cc, inOuter && (onBorder || inCenter) ? 1 : 0);
      }
    }
  };

  placeFinder(0, 0);
  placeFinder(0, n - 7);
  placeFinder(n - 7, 0);

  // Alignment patterns
  if (spec.align.length >= 2) {
    const pos = spec.align[1];
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const val = Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0) ? 1 : 0;
        setModule(pos + r, pos + c, val);
      }
    }
  }

  // Timing patterns
  for (let i = 8; i < n - 8; i++) {
    const val = i % 2 === 0 ? 1 : 0;
    if (!reserved[6][i]) setModule(6, i, val);
    if (!reserved[i][6]) setModule(i, 6, val);
  }

  // Dark module
  setModule(n - 8, 8, 1);

  // Reserve format info cells
  for (let i = 0; i < 9; i++) {
    if (!reserved[8][i]) reserved[8][i] = true;
    if (!reserved[i][8]) reserved[i][8] = true;
  }
  for (let i = n - 8; i < n; i++) {
    reserved[8][i] = true;
    reserved[i][8] = true;
  }

  // Place data bits in zig-zag
  const bitStream = [];
  for (const cw of finalCodewords) {
    for (let b = 7; b >= 0; b--) bitStream.push((cw >> b) & 1);
  }

  let bitIdx = 0;
  let up = true;
  for (let col = n - 1; col > 0; col -= 2) {
    if (col === 6) col--;
    for (let step = 0; step < n; step++) {
      const row = up ? n - 1 - step : step;
      for (let offset = 0; offset < 2; offset++) {
        const c = col - offset;
        if (!reserved[row][c]) {
          const bit = bitIdx < bitStream.length ? bitStream[bitIdx++] : 0;
          // Apply mask pattern 0: (row + col) % 2 === 0
          const masked = (row + c) % 2 === 0 ? bit ^ 1 : bit;
          grid[row][c] = masked;
        }
      }
    }
    up = !up;
  }

  // Format information for ECC L (01) + Mask 0 (000) -> 01000
  // Precomputed BCH(15,5) masked with 101010000010010 -> 111011111000100 (0x77C4)
  const formatBits = [1, 1, 1, 0, 1, 1, 1, 1, 1, 0, 0, 0, 1, 0, 0];
  const topLeftCoords = [
    [8, 0], [8, 1], [8, 2], [8, 3], [8, 4], [8, 5], [8, 7], [8, 8],
    [7, 8], [5, 8], [4, 8], [3, 8], [2, 8], [1, 8], [0, 8]
  ];
  for (let i = 0; i < 15; i++) {
    grid[topLeftCoords[i][0]][topLeftCoords[i][1]] = formatBits[i];
  }
  for (let i = 0; i < 7; i++) {
    grid[n - 1 - i][8] = formatBits[i];
  }
  for (let i = 7; i < 15; i++) {
    grid[8][n - 15 + i] = formatBits[i];
  }

  return grid;
}

export function generateQrMatrix(text) {
  const { spec, finalCodewords } = encodeByteData(String(text || 'IGNITRON-2K26'));
  return buildMatrix(spec, finalCodewords);
}

export function generateQrSvgDataUrl(text, darkColor = '#050505', lightColor = '#ffffff') {
  const matrix = generateQrMatrix(text);
  const size = matrix.length;
  const quiet = 2;
  const total = size + quiet * 2;
  let rects = '';
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      if (matrix[r][c] === 1) {
        rects += `<rect x="${c + quiet}" y="${r + quiet}" width="1" height="1" fill="${darkColor}"/>`;
      }
    }
  }
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges"><rect width="${total}" height="${total}" fill="${lightColor}"/>${rects}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
