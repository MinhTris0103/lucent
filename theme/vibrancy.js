// Chạy ở main process (chèn đầu bootstrap.js): cửa sổ lớn của Zalo thành trong suốt thật, nhìn xuyên xuống màn hình.
// transparent chỉ đặt được lúc tạo cửa sổ → bọc BrowserWindow. VIBRANCY: "" = xuyên thẳng, hoặc "under-window"/"hud"/... = mờ kiểu macOS.
const VIBRANCY = "under-window"; // blur xuyên nền như terminal; độ tối chỉnh bằng --zg-tint trong transparent.css (hud thì gần như đặc)
const electron = require("electron");
const log = (m) => { try { require("fs").appendFileSync("/tmp/zalo-vib.log", m + "\n"); } catch {} };
electron.nativeTheme.themeSource = "dark"; // vật liệu blur luôn tối, không phụ thuộc light/dark của macOS
const Orig = electron.BrowserWindow;
class Glass extends Orig {
  constructor(o = {}) {
    const big = (o.width || 0) >= 400; // bỏ popup thông báo nhỏ (352px)
    if (big) { o = { ...o, transparent: true, backgroundColor: "#00000000", hasShadow: true, ...(VIBRANCY && { vibrancy: VIBRANCY }) }; }
    super(o);
    this.glass = big;
  }
  setBackgroundColor(c) { if (!this.glass) super.setBackgroundColor(c); } // Zalo tô lại nền theo theme → giữ trong suốt
}
// electron.BrowserWindow không ghi đè được → chặn require("electron") trả về bản proxy có Glass
const Module = require("module"), load = Module._load;
const proxy = new Proxy(electron, { get: (t, k) => (k === "BrowserWindow" ? Glass : t[k]) });
Module._load = function (req, ...r) { const m = load.call(this, req, ...r); return req === "electron" && m === electron ? proxy : m; };
