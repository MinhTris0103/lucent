// Thêm mục "Tạo cuộc họp Google Meet" vào menu "..." của thanh công cụ chat (ngay sau "Tạo ghi chú").
// Nhân bản chính mục ghi chú để giữ nguyên style/hover của Zalo; bấm sẽ mở meet.google.com/new bằng trình duyệt mặc định.
(() => {
  if (location.pathname.endsWith("popup-viewer.html")) return;
  const ICON = '<svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="6" width="12" height="12" rx="2"/><path d="M15 10.5l6-3.5v10l-6-3.5"/></svg>';
  const LABEL = "Tạo cuộc họp Google Meet";

  // menu nhóm có "Tạo ghi chú", menu 1-1 chỉ có "Tạo nhắc hẹn" → gắn sau mục cuối trong hai mục đó
  const add = () => {
    const items = [...document.querySelectorAll(".zmenu-item")].filter((e) => ["Tạo ghi chú", "Tạo nhắc hẹn"].includes(e.textContent.trim()));
    const note = items.pop();
    if (!note || note.parentElement.querySelector(".zg-meet")) return;
    const item = note.cloneNode(true);
    item.classList.add("zg-meet");
    item.removeAttribute("data-id");
    // thay chữ; tìm node chữ theo nội dung để khỏi phụ thuộc class của Zalo
    const w = document.createTreeWalker(item, NodeFilter.SHOW_TEXT);
    for (let n; (n = w.nextNode()); ) if (n.nodeValue.trim()) { n.nodeValue = LABEL; break; }
    // giữ nguyên thẻ icon (để còn đúng cỡ/lề), chỉ bỏ class glyph font và nhét SVG vào
    const ic = item.querySelector(".menu-icon");
    if (ic) {
      [...ic.classList].filter((c) => /_\d+_Line$/.test(c)).forEach((c) => ic.classList.remove(c));
      ic.innerHTML = ICON;
    }
    item.addEventListener("click", (e) => {
      e.stopPropagation(); e.preventDefault();
      window.open("https://meet.google.com/new", "_blank");
      document.body.dispatchEvent(new MouseEvent("mousedown", { bubbles: true })); // đóng menu
    }, true);
    note.after(item);
  };

  let q = 0; // ponytail: gộp mọi đột biến trong 1 frame, khỏi quét .zmenu-item cho từng mutation
  new MutationObserver(() => q || (q = requestAnimationFrame(() => { q = 0; add(); }))).observe(document.documentElement, { childList: true, subtree: true });
})();
