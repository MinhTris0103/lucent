// Album ảnh kiểu Threads: ô cao cố định, rộng theo tỉ lệ ảnh thật; nút ‹ › + chỉ báo "k/N"; cuộn ngang bằng trackpad/shift+wheel.
// Zalo chặn cuộn ngang native nên tự xử lý wheel; React vẽ lại thì quét lại.
(() => {
  const H = 250;
  const ab = (dir) => Object.assign(document.createElement("button"), { className: "zg-ab zg-ab-" + dir, type: "button", ariaLabel: dir });

  const update = (box, a) => {
    const items = [...a.children].filter((i) => i.classList.contains("album__item"));
    items.forEach((it) => {
      const img = it.querySelector("img");
      if (img && img.naturalHeight) it.style.setProperty("--ar", img.naturalWidth / img.naturalHeight);
    });
    const max = a.scrollWidth - a.clientWidth, x = a.scrollLeft;
    box.classList.toggle("zg-prev", x > 4);
    box.classList.toggle("zg-next", x < max - 4);
    let k = items.findIndex((it) => it.offsetLeft + it.offsetWidth > x + 24) + 1;
    if (x >= max - 4) k = items.length;
    const c = box.querySelector(".zg-count");
    const t = `${k || 1}/${items.length}`;
    if (c && c.textContent !== t) c.textContent = t; // ghi lại cùng giá trị cũng kích MutationObserver → vòng lặp vô hạn
  };

  const setup = (a) => {
    const box = a.parentElement;
    if (!box) return;
    box.querySelectorAll(".zg-ab, .zg-count").forEach((n) => n.remove());
    const prev = ab("prev"), next = ab("next"), count = Object.assign(document.createElement("span"), { className: "zg-count" });
    const go = (s) => (e) => { e.stopPropagation(); e.preventDefault(); a.scrollBy({ left: s * a.clientWidth * 0.8, behavior: "smooth" }); };
    prev.onclick = go(-1); next.onclick = go(1);
    box.append(prev, next, count);
    const upd = () => update(box, a);
    a.addEventListener("scroll", upd, { passive: true });
    a.addEventListener("load", upd, true); // load không bubble → bắt ở capture
    box.addEventListener("wheel", (e) => {
      if (!document.body.classList.contains("zg-album") || Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return; // cuộn dọc vẫn dành cho khung chat
      a.scrollLeft += e.deltaX; e.preventDefault(); e.stopPropagation();
    }, { passive: false, capture: true });
    a.dataset.zg = "1";
  };

  let raf = 0;
  const scan = () => {
    raf = 0;
    document.querySelectorAll(".album").forEach((a) => {
      if (a.querySelectorAll(":scope > .album__item").length < 2) return;
      if (!a.parentElement) return;
      if (!a.dataset.zg || !a.parentElement.querySelector(".zg-count")) setup(a);
      update(a.parentElement, a);
    });
  };
  const init = () => { new MutationObserver(() => raf || (raf = requestAnimationFrame(scan))).observe(document.body, { childList: true, subtree: true }); scan(); };
  document.body ? init() : addEventListener("DOMContentLoaded", init);
})();
