// Metadata parsing only: bounded PCM WAV or complete Layer III frame streams.
export function audioDuration(
  b: Uint8Array,
  contentType: string,
): number | undefined {
  const bad = (): undefined => undefined;
  if (!["audio/mpeg", "audio/wav", "audio/x-wav"].includes(contentType))
    return bad();
  if (contentType !== "audio/mpeg") {
    const v = new DataView(b.buffer, b.byteOffset, b.byteLength),
      tag = (n: number) => Buffer.from(b.subarray(n, n + 4)).toString("ascii");
    if (
      b.length < 44 ||
      tag(0) !== "RIFF" ||
      tag(8) !== "WAVE" ||
      v.getUint32(4, true) + 8 !== b.length
    )
      return bad();
    let rate = 0,
      align = 0,
      bytes = 0,
      fmt = false,
      seen = false;
    for (let at = 12; at < b.length;) {
      if (at + 8 > b.length) return bad();
      const size = v.getUint32(at + 4, true),
        end = at + 8 + size;
      if (end > b.length) return bad();
      if (tag(at) === "fmt ") {
        if (fmt || size < 16) return bad();
        fmt = true;
        const channels = v.getUint16(at + 10, true),
          sampleRate = v.getUint32(at + 12, true),
          bits = v.getUint16(at + 22, true);
        rate = v.getUint32(at + 16, true);
        align = v.getUint16(at + 20, true);
        if (
          v.getUint16(at + 8, true) !== 1 ||
          ![1, 2].includes(channels) ||
          ![8, 16, 24, 32].includes(bits) ||
          !sampleRate ||
          align !== (channels * bits) / 8 ||
          rate !== sampleRate * align
        )
          return bad();
      }
      if (tag(at) === "data") {
        if (seen) return bad();
        seen = true;
        bytes = size;
      }
      at = end + (size % 2);
      if (at > b.length) return bad();
    }
    if (!fmt || !seen || !bytes || bytes % align) return bad();
    return bytes / rate;
  }
  let at = 0,
    duration = 0,
    frames = 0;
  if (b.length >= 10 && Buffer.from(b.subarray(0, 3)).toString() === "ID3") {
    if (
      b[3] < 2 ||
      b[3] > 4 ||
      b[5] & 0x10 ||
      b.subarray(6, 10).some((x) => x & 128)
    )
      return bad();
    at = 10 + ((b[6] << 21) | (b[7] << 14) | (b[8] << 7) | b[9]);
  }
  while (at < b.length) {
    if (at + 4 > b.length) return bad();
    const a = b[at + 1],
      c = b[at + 2],
      version = (a >> 3) & 3,
      index = c >> 4,
      sample = (c >> 2) & 3;
    if (
      b[at] !== 255 ||
      (a & 224) !== 224 ||
      version === 1 ||
      ((a >> 1) & 3) !== 1 ||
      index === 0 ||
      index === 15 ||
      sample === 3
    )
      return bad();
    const hz =
        [44100, 48000, 32000][sample] /
        (version === 3 ? 1 : version === 2 ? 2 : 4),
      kbps = (
        version === 3
          ? [0, 32, 40, 48, 56, 64, 80, 96, 112, 128, 160, 192, 224, 256, 320]
          : [0, 8, 16, 24, 32, 40, 48, 56, 64, 80, 96, 112, 128, 144, 160]
      )[index];
    const length =
      Math.floor(((version === 3 ? 144 : 72) * kbps * 1000) / hz) +
      ((c >> 1) & 1);
    if (at + length > b.length) return bad();
    duration += (version === 3 ? 1152 : 576) / hz;
    at += length;
    frames++;
  }
  return frames ? duration : bad();
}
