// Sửa file trong app.asar mà không giải nén/đóng gói lại: giữ nguyên vùng dữ liệu cũ, nối file mới vào cuối, ghi lại header.
// Không phụ thuộc gì ngoài Node/Electron-as-node (không cần npm, không cần mạng).
// ponytail: file bị sửa để lại vùng dữ liệu cũ trong asar (vài chục KB); không dọn.
import fs from "node:fs";
import { createHash } from "node:crypto";

const BLOCK = 4 * 1024 * 1024;
const sha = (b) => createHash("sha256").update(b).digest("hex");

// edits: { "pc-dist/index.html": (cũ: Buffer|null) => string|Buffer|falsy }. Trả về sha256 của header (dùng cho ElectronAsarIntegrity trên macOS).
export function patchAsar(src, dst, edits) {
  process.noAsar = true; // Electron-as-node sẽ coi *.asar là thư mục ảo nếu không tắt
  const d = fs.readFileSync(src), n = d.readUInt32LE(12), base = 8 + d.readUInt32LE(4);
  const hdr = JSON.parse(d.toString("utf8", 16, 16 + n));
  const tail = []; let off = d.length - base;
  for (const [p, fn] of Object.entries(edits)) {
    const parts = p.split("/"), name = parts.pop();
    let dir = hdr; for (const s of parts) dir = dir.files[s];
    const old = dir.files[name];
    if (old && old.offset === undefined) throw new Error(`${p} nằm trong app.asar.unpacked, không sửa được`);
    const out = fn(old ? d.subarray(base + +old.offset, base + +old.offset + old.size) : null);
    if (!out) continue; // fn trả falsy = bỏ qua (vd. file không tồn tại ở bản Zalo này)
    const buf = Buffer.from(out);
    const blocks = []; for (let i = 0; i < buf.length; i += BLOCK) blocks.push(sha(buf.subarray(i, i + BLOCK)));
    dir.files[name] = { ...old, size: buf.length, offset: String(off), integrity: { algorithm: "SHA256", hash: sha(buf), blockSize: BLOCK, blocks } };
    tail.push(buf); off += buf.length;
  }
  const json = Buffer.from(JSON.stringify(hdr)), len = Math.ceil(json.length / 4) * 4; // pickle căn 4 byte
  const head = Buffer.alloc(16 + len);
  head.writeUInt32LE(4, 0); head.writeUInt32LE(len + 8, 4); head.writeUInt32LE(len + 4, 8); head.writeUInt32LE(json.length, 12);
  json.copy(head, 16);
  fs.writeFileSync(dst, Buffer.concat([head, d.subarray(base), ...tail]));
  return sha(json);
}
