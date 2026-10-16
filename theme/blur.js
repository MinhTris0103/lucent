// Che tin nhắn kiểu ZaDark: mục trong sidebar mở menu bật/tắt từng phần, lưu localStorage (chung cho cửa sổ chính và viewer ảnh, đồng bộ qua sự kiện storage).
// Nhóm 1: danh sách hội thoại (msg/name/avatar). Nhóm 2: trong khung chat (cmsg/cimg/cname). Nhóm 3: cửa sổ xem ảnh (view).
(() => {
  const ICON = (p) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
  const KEY = "zg-hide", VIEWER = location.pathname.endsWith("popup-viewer.html");
  // icon nét mảnh 24px như menu Cài đặt của Zalo
  const I = {
    list: ICON('<path d="M4 6h16M4 12h16M4 18h10"/>'),
    chat: ICON('<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12z"/>'),
    img: ICON('<rect x="3" y="4" width="18" height="16" rx="3"/><circle cx="9" cy="10" r="1.8"/><path d="M3 17l5-4.5 4 3.5 3-2.5 6 4.5"/>'),
    album: ICON('<rect x="3" y="6" width="14" height="12" rx="2"/><path d="M20 8v8M7 3h10"/>'),
    pet: ICON('<circle cx="8" cy="8" r="1.7"/><circle cx="16" cy="8" r="1.7"/><circle cx="5" cy="13" r="1.7"/><circle cx="19" cy="13" r="1.7"/><path d="M12 12c-3 0-5 3-5 5 0 1.5 1.5 2 3 1.5 1.3-.4 2.7-.4 4 0 1.5.5 3 0 3-1.5 0-2-2-5-5-5z"/>'),
    perf: ICON('<path d="M13 3L5 14h6l-1 7 8-11h-6z"/>'),
  };
  const GROUPS = [
    ["Ẩn trong danh sách hội thoại", I.list, [["msg", "Tin nhắn"], ["name", "Tên"], ["avatar", "Ảnh đại diện"]]],
    ["Ẩn trong hội thoại", I.chat, [["cmsg", "Nội dung tin nhắn"], ["cimg", "Ảnh / album"], ["cname", "Tên & avatar"]]],
    ["Ẩn khi xem ảnh", I.img, [["view", "Ảnh, thumbnail, người gửi"]]],
    ["Hiển thị ảnh trong hội thoại", I.album, "album"], // select: Mặc định (dạng gốc của Zalo) | Cuộn ngang
    ["Pet (Mochi)", I.pet, [["pet", "Hiện Mochi"], ["petbig", "Phóng to Mochi khi đang che"]]], // Hiện Mochi mặc định bật, Phóng to mặc định tắt; pet.js đọc class zg-pet-off / zg-pet-big
  ];
  const OPTS = GROUPS.flatMap(([, , o]) => (Array.isArray(o) ? o : [["album"]])), PET = ["pet", "petbig", "album"], isOn = (k) => (k === "pet" ? st[k] !== false : !!st[k]); // chỉ "pet" mặc định bật
  const svg = (extra) => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/>${extra}</svg>`;
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch { return {}; } };
  let st = load();
  document.documentElement.classList.toggle("zg-mac", /Mac/.test(navigator.platform)); // phím tắt hiển thị ⌘ trên Mac, Ctrl nơi khác
  let btn, menu, body, foot;

  const render = () => {
    // "view" chỉ áp ở viewer: ảnh trong khung chat cũng dùng class zimg-el
    OPTS.forEach(([k]) => !PET.includes(k) && document.body.classList.toggle("zg-hide-" + k, !!st[k] && (k !== "view" || VIEWER)));
    document.body.classList.toggle("zg-album", !!st.album); // mặc định tắt
    document.body.classList.toggle("zg-pet-big", isOn("petbig"));
    document.body.classList.toggle("zg-pet-off", !isOn("pet"));
    const any = OPTS.some(([k]) => !PET.includes(k) && st[k]);
    if (btn) { btn.classList.toggle("on", any); btn.innerHTML = svg(any ? '<path d="M3 3l18 18"/>' : ""); btn.title = "Che tin nhắn & tuỳ chọn"; }
  };

  // Nhóm "Hiệu năng": đọc/ghi qua server localhost ở main process (ocr-main.js ↔ opts-main.js), áp dụng khi mở lại Zalo
  const PERF = [["ram", "Giảm RAM (low-end mode)"], ["noUpdate", "Tắt tự cập nhật"], ["throttle", "Giảm tải khi ẩn / thu nhỏ"], ["lazyNoti", "Hoãn nạp cửa sổ thông báo"], ["noCap", "Tắt ZaloCap (chụp màn hình)", "Khi tắt ZaloCap, Zalo không dán (paste) được ảnh/file từ clipboard vào khung chat. Cần dán ảnh/file thì đừng bật mục này."], ["noCall", "Tắt ZaloCall (gọi thoại / video)"]];
  const API = "http://127.0.0.1:47831/config";
  const sech = (icon, title) => { const h = document.createElement("div"); h.className = "zg-h"; h.innerHTML = icon; h.append(title); return h; };
  const perf = async () => {
    try {
      const cfg = await (await fetch(API)).json(), box = document.createElement("section");
      box.append(sech(I.perf, "Hiệu năng"));
      PERF.forEach(([k, label, tip]) => {
        const l = document.createElement("label");
        l.innerHTML = `<span>${label}</span><input type="checkbox">`;
        if (tip) { // (i) rê chuột / bấm để xem giải thích
          const i = Object.assign(document.createElement("i"), { className: "zg-i", textContent: "i", tabIndex: 0 });
          i.dataset.tip = tip; i.onclick = (e) => e.preventDefault();
          l.firstChild.append(i);
        }
        const c = l.lastChild; c.checked = !!cfg[k];
        c.onchange = () => { fetch(`${API}?set=${k}&v=${+c.checked}`).catch(() => {}); foot.classList.add("dirty"); };
        box.append(l);
      });
      body.append(box); foot.hidden = false;
    } catch {} // server chưa chạy / viewer không có → bỏ nhóm
  };

  const buildMenu = () => {
    menu = Object.assign(document.createElement("div"), { id: "zg-menu" }); // lớp phủ; hộp thoại nằm trong
    const dlg = document.createElement("div"), head = document.createElement("header"), x = Object.assign(document.createElement("button"), { type: "button", className: "zg-x", ariaLabel: "Đóng", innerHTML: ICON('<path d="M5 5l14 14M19 5L5 19"/>') });
    dlg.className = "zg-dlg";
    head.append(Object.assign(document.createElement("h2"), { textContent: "Tuỳ chọn Glass" }), x);
    body = Object.assign(document.createElement("div"), { className: "zg-body" });
    foot = Object.assign(document.createElement("footer"), { hidden: true }); // chỉ hiện khi có nhóm Hiệu năng (cần server localhost của main process)
    const rb = Object.assign(document.createElement("button"), { type: "button", textContent: "Khởi động lại" });
    rb.onclick = () => fetch(API.replace("/config", "/restart"), { method: "POST" }).catch(() => {});
    foot.append(Object.assign(document.createElement("span"), { textContent: "Khởi động lại Zalo để áp dụng thay đổi Hiệu năng" }), rb);
    dlg.append(head, body, foot); menu.append(dlg);
    x.onclick = () => menu.classList.remove("open");
    GROUPS.forEach(([title, icon, opts]) => {
      const sec = document.createElement("section"), h = sech(icon, title);
      sec.append(h);
      if (!Array.isArray(opts)) { // select Mặc định / Cuộn ngang
        const s = document.createElement("select");
        s.dataset.k = opts; s.innerHTML = '<option value="">Mặc định</option><option value="1">Cuộn ngang</option>'; s.value = isOn(opts) ? "1" : "";
        s.onchange = () => { st[opts] = !!s.value; try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {} render(); };
        h.append(s); body.append(sec); return;
      }
      opts.forEach(([k, label]) => {
        const l = document.createElement("label");
        l.innerHTML = `<span>${label}</span><input type="checkbox" data-k="${k}">`;
        const c = l.lastChild; c.checked = isOn(k);
        c.onchange = () => { st[k] = c.checked; try { localStorage.setItem(KEY, JSON.stringify(st)); } catch {} render(); };
        sec.append(l);
      });
      body.append(sec);
    });
    perf();
    document.body.append(menu);
    menu.addEventListener("mousedown", (e) => { if (e.target === menu) menu.classList.remove("open"); }); // bấm nền mờ để đóng
    addEventListener("keydown", (e) => { if (e.key === "Escape" && menu.classList.contains("open")) { menu.classList.remove("open"); e.stopPropagation(); } }, true);
  };

  // React vẽ lại sidebar thì mục bị mất → gắn lại
  const mount = () => {
    const nav = document.querySelector(".nav__tabs__bottom");
    if (!nav || nav.contains(btn)) return;
    if (!btn) {
      btn = Object.assign(document.createElement("div"), { id: "zg-nav", className: "nav__tabs__bottom__btn" });
      buildMenu();
      btn.onclick = () => menu.classList.toggle("open");
    }
    nav.prepend(btn);
    render();
  };

  addEventListener("storage", (e) => {
    if (e.key !== KEY) return;
    st = load(); render();
    menu?.querySelectorAll("input[data-k]").forEach((c) => (c.checked = isOn(c.dataset.k)));
    menu?.querySelectorAll("select[data-k]").forEach((s) => (s.value = isOn(s.dataset.k) ? "1" : ""));
  });

  const init = () => { render(); let q = 0; new MutationObserver(() => q || (q = requestAnimationFrame(() => { q = 0; mount(); }))).observe(document.body, { childList: true, subtree: true }); mount(); };
  document.body ? init() : addEventListener("DOMContentLoaded", init);
})();
