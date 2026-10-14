// Phím tắt: Esc trong khung chat → về danh sách hội thoại; ↑/↓ chuyển hội thoại, Enter mở lại khi đang ở danh sách.
// Đọc tin nhắn: ↑ trong ô soạn trống → vào chế độ duyệt; ↑/↓ (hoặc k/j) đổi tin, R trả lời, F chuyển tiếp, E thả cảm xúc (rồi 1–6, 7 = gỡ), Esc thoát duyệt.
(() => {
  let cur = null; // hội thoại đang chọn (nhớ theo click, vì không biết class "selected" của Zalo)
  const items = () => [...document.querySelectorAll(".conv-item")];
  const typing = (t) => t.closest?.('input, textarea, [contenteditable="true"]');
  const popup = () => document.querySelector(".zl-modal__dialog, .zmenu-body, .popover");

  document.addEventListener("click", (e) => { const i = e.target.closest?.(".conv-item"); if (i) cur = i; }, true);

  // Zalo nghe cả chuỗi pointer/mouse (và bỏ qua/đóng nếu toạ độ nằm ngoài) chứ không chỉ click
  const press = (el) => {
    const r = el.getBoundingClientRect(), o = { bubbles: true, cancelable: true, button: 0, view: window, clientX: r.x + r.width / 2, clientY: r.y + r.height / 2 };
    ["pointerdown", "mousedown", "pointerup", "mouseup", "click"].forEach((t) => el.dispatchEvent(new (t[0] === "p" ? PointerEvent : MouseEvent)(t, o)));
  };

  // ---- hộp thoại Chia sẻ: ↑/↓ chọn dòng, Enter tick/bỏ tick, Ctrl/Cmd+Enter bấm "Chia sẻ" ----
  let cur_row = null;
  const share = (e) => {
    const dlg = [...document.querySelectorAll(".zl-modal__dialog")].find((d) => d.querySelector(".share-msg__conv-item"));
    if (!dlg) return false;
    const rows = [...dlg.querySelectorAll(".share-msg__conv-item")];
    let i = rows.indexOf(cur_row);
    if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) { const b = dlg.querySelector(".btn-primary"); if (b) press(b); }
    else if (e.metaKey || e.ctrlKey || e.altKey) return false;
    else if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      cur_row?.classList.remove("zg-row");
      cur_row = rows[Math.max(0, Math.min(rows.length - 1, i + (e.key === "ArrowDown" ? 1 : -1)))];
      cur_row?.classList.add("zg-row");
      cur_row?.scrollIntoView({ block: "nearest" });
    } else if (e.key === "Enter") { if (cur_row?.isConnected) press(cur_row); }
    else return false;
    e.preventDefault(); e.stopPropagation();
    return true;
  };

  // ---- duyệt tin nhắn ----
  const msgs = () => [...document.querySelectorAll('#messageViewScroll [id^="bb_msg_id"]')];
  let br = null;
  const mark = (m) => {
    if (br) {
      br.classList.remove("zg-msg-focus");
      const o = br.closest('[id^="message-frame"]') || br;
      ["mouseout", "mouseleave"].forEach((t) => o.dispatchEvent(new MouseEvent(t, { bubbles: true })));
    }
    pickClose();
    br = m;
    if (!m) return;
    m.classList.add("zg-msg-focus");
    m.scrollIntoView({ block: "nearest" });
    // nút Reply/Forward của Zalo chỉ vẽ khi rê chuột vào tin → giả lập hover
    const f = m.closest('[id^="message-frame"]') || m;
    ["mouseover", "mouseenter", "mousemove"].forEach((t) => f.dispatchEvent(new MouseEvent(t, { bubbles: true })));
  };
  const act = (title) => {
    const b = (br.closest('[id^="message-frame"]') || br).querySelector(`.MSABtn-btn[data-translate-title="${title}"]`);
    if (b) press(b); // phải bấm trước khi mark(null) gỡ hover (nút sẽ biến mất)
    mark(null);
    if (title === "STR_REPLY_MSG") setTimeout(() => document.querySelector(".rich-input")?.focus(), 50);
  };
  // thả cảm xúc: E mở bảng 6 emoji của Zalo (giả lập rê chuột vào nút react), 1–6 chọn, Esc/phím khác đóng
  const hover = (el, on) => (on ? ["mouseover", "mouseenter", "mousemove"] : ["mouseout", "mouseleave"]).forEach((t) => el.dispatchEvent(new MouseEvent(t, { bubbles: true })));
  const reactIcon = () => (br.closest('[id^="message-frame"]') || br).querySelector(".msg-reaction-icon");
  let picking = null;
  const pickClose = () => { if (picking) { picking.classList.remove("zg-pick"); hover(reactIcon() || picking, false); } picking = null; };
  const pickOpen = () => {
    const ic = reactIcon();
    if (!ic) return;
    hover(ic, true);
    setTimeout(() => {
      picking = ic.parentElement.querySelector(".reaction-emoji-list");
      picking?.classList.add("zg-pick");
      picking?.querySelectorAll(".reaction-emoji-icon").forEach((n, k) => n.setAttribute("data-zg", k + 1));
    }, 80);
  };
  const browse = (e) => {
    const list = msgs(), i = list.indexOf(br);
    if (picking) {
      const n = +e.key, em = picking.querySelectorAll(".reaction-emoji-icon")[n - 1];
      if (em) press(em);
      pickClose();
      if (!em && e.key !== "Escape") return; // phím khác chỉ đóng bảng
      e.preventDefault(); e.stopPropagation();
      return;
    }
    if (e.key === "e" || e.key === "E") pickOpen();
    else if (e.key === "Escape") { mark(null); document.querySelector(".rich-input")?.focus(); }
    else if (e.key === "ArrowUp" || e.key === "k") mark(list[i < 0 ? list.length - 1 : Math.max(0, i - 1)]);
    else if (e.key === "ArrowDown" || e.key === "j") { if (i >= list.length - 1) { mark(null); document.querySelector(".rich-input")?.focus(); } else mark(list[i + 1]); }
    else if (e.key === "r" || e.key === "R") act("STR_REPLY_MSG");
    else if (e.key === "f" || e.key === "F") act("STR_FORWARD_MSG");
    else return;
    e.preventDefault(); e.stopPropagation();
  };

  document.addEventListener("keydown", (e) => {
    if (share(e)) return;
    if (e.metaKey || e.ctrlKey || e.altKey) return;
    if (br && !br.isConnected) mark(null);
    if (br) return browse(e);
    if (e.key === "ArrowUp" && e.target.closest?.(".rich-input.empty") && msgs().length) {
      e.target.blur(); mark(msgs().at(-1)); e.preventDefault(); e.stopPropagation(); return;
    }
    if (e.key === "Escape") {
      if (popup()) return; // để Zalo đóng dialog/menu trước
      const close = document.querySelector(".quote-banner [data-translate-title=STR_CLOSE]"); // đang reply → Esc bỏ reply
      if (close) { press(close); document.querySelector(".rich-input")?.focus(); e.preventDefault(); return; }
      const a = document.activeElement;
      if (typing(a)) a.blur();
      const back = document.querySelector(".conv-back-btn"); // cửa sổ hẹp: chat đè lên danh sách → bấm nút ‹ của Zalo
      if (back && back.offsetParent) back.click();
      setTimeout(() => {
        const t = document.querySelector(".conv-item.selected") || (cur && cur.isConnected ? cur : items()[0]);
        if (t) { t.tabIndex = -1; t.focus(); t.scrollIntoView({ block: "nearest" }); }
      }, 150);
      e.preventDefault();
    } else if ((e.key === "ArrowDown" || e.key === "ArrowUp") && !typing(e.target) && document.activeElement?.closest?.(".conv-item")) {
      const list = items(), i = list.indexOf(document.activeElement.closest(".conv-item")) + (e.key === "ArrowDown" ? 1 : -1);
      if (!list[i]) return;
      list[i].tabIndex = -1; list[i].focus(); list[i].scrollIntoView({ block: "nearest" });
      e.preventDefault();
    } else if (e.key === "Enter" && !typing(e.target)) {
      const i = document.activeElement?.closest?.(".conv-item");
      if (i) { cur = i; i.click(); }
    }
  }, true);
})();
