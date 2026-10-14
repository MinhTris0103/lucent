// Mochi — mèo pixel-mềm sống ở hai chỗ trống của Zalo (không đụng DOM của React, chỉ là một lớp fixed đặt theo toạ độ):
//  • có khung chat hiện (cả cửa sổ lớn lẫn cửa sổ nhỏ đang mở hội thoại): đứng trên thanh công cụ soạn tin;
//  • cửa sổ nhỏ đang ở danh sách: đi qua đi lại ở khoảng trống giữa tab "Khác" và nút "Phân loại".
// Tính cách: hay hờn, mê ăn, thích bị chọc nhưng chọc nhiều là giận. Không đọc nội dung tin nhắn.
(() => {
  if (location.pathname.endsWith("popup-viewer.html")) return;
  const W = 36, H = 32, SPEED = 45, SLEEP_AFTER = 60000;
  const LINES = [
    "Người ta đặt vé về quê ăn lễ, còn mình đặt niềm tin sẽ xong KPI tuần này 🙏", "Tạm gác cuộc đời nô lệ tư bản, ê hề lô 🐥", "Hết ngày mai nữa là phải làm nô lệ cho… à mà nay cũng đang làm rồi 🥲",
    "Cảm xúc chạy task của nô lệ tư bản: 🙂😐🙃💀", "Mình thở bằng bình oxy để sống sót qua deadline 😮‍💨", "Nhắn nhanh đi, mình đói rồi 🍙",
    "Đừng chọc nữa, nhột! Mình đang bận… ngồi không", "Reply người ta đi, để lâu mất duyên, mất luôn khách đó", "Uống nước chưa? Chưa thì uống, rồi thì uống nữa 💧",
    "Meo. (dịch: sếp ơi cho em nghỉ)", "Mình không lười, mình tiết kiệm năng lượng cho deadline 🔋", "Ai nhắn mà im re vậy ta… seen rồi bỏ mình hả 😭",
    "Cho mình xin cá khô, không có lương thì có cá 🐟", "Ngồi lâu rồi, đứng dậy vươn vai đi kẻo thành hoá thạch 🦴", "Hứ, mình đâu có quan tâm đâu 😼 (có đó)",
    "Họp xong cuộc họp để lên lịch cuộc họp tiếp theo 📅", "Task xong 99%. 1% còn lại là cả cuộc đời", "Hôm nay mình làm việc rất chăm: nằm nghĩ về việc phải làm",
    "Cà phê là nhiên liệu, drama là gia vị ☕", "Sếp nhắn 'em rảnh không?' là mình tim ngừng 3 nhịp 💔", "Mình chỉ là con mèo, mà áp lực như con người 🐱",
  ];
  const TYPING = ["Ồ, đang gõ gì đó… gõ nhanh coi, mình đói", "Viết gì mà dài thế 😳 báo cáo hay tâm sự?", "Mình không nhìn trộm đâu, thề! (nhìn chằm chằm)", "Gõ đi gõ đi, mình đợi, mình có cả ngày 🍿", "Gõ rồi xoá, gõ rồi xoá… biết rồi nha 🤭"];
  const MAD = ["Thôi nha! Mình giận á 😾", "Chọc nữa là mình nghỉ việc đó!", "Hứ! Mình đi nộp đơn xin nghỉ đây", "Đủ rồi, mình lên HR báo cáo bạn 📋"];
  const timeLine = () => {
    const h = new Date().getHours();
    if (h >= 23 || h < 5) return "Khuya rồi, ngủ đi, deadline không chạy mất đâu 🌙";
    if (h >= 11 && h < 13) return "Trưa rồi, ăn cơm chưa nè 🍚 Không ăn là xỉu đó";
    if (h >= 17 && h < 19) return "Hết giờ rồi, về đi… à mà ai tin 🥲";
    return null;
  };
  const pick = (a) => a[Math.floor(Math.random() * a.length)];
  const wait = (ms) => new Promise((r) => setTimeout(r, ms));

  const eye = (cx) => `<circle cx="${cx}" cy="21" r="2.6" fill="#2b2118"/><circle class="zp-pupil" cx="${cx - .7}" cy="20.2" r=".9" fill="#fff"/>`;
  const arc = (cx, d) => `<path d="M${cx - 2.6} ${d} q2.6 -3.4 5.2 0" fill="none" stroke="#2b2118" stroke-width="1.6" stroke-linecap="round"/>`;
  const pet = Object.assign(document.createElement("div"), { id: "zg-pet" });
  pet.innerHTML = `
    <div class="zp-bubble"></div>
    <div class="zp-hop"><div class="zp-flip"><svg class="zp-sprite" viewBox="0 0 40 36" width="${W}" height="${H}">
      <path class="zp-tail" d="M33 28 q8 -2 5 -11" fill="none" stroke="#f59a4a" stroke-width="3.4" stroke-linecap="round"/>
      <rect class="zp-leg zp-leg-a" x="10" y="30" width="6" height="5" rx="2.5" fill="#f59a4a"/>
      <rect class="zp-leg zp-leg-b" x="24" y="30" width="6" height="5" rx="2.5" fill="#f59a4a"/>
      <g class="zp-body">
        <path d="M8.5 15 L10.5 3.5 L18.5 12Z M31.5 15 L29.5 3.5 L21.5 12Z" fill="#ffb26b" stroke="#ffb26b" stroke-width="2" stroke-linejoin="round"/>
        <path d="M11.2 11.5 L11.8 7 L15 10.4Z M28.8 11.5 L28.2 7 L25 10.4Z" fill="#ff9fb0"/>
        <rect x="5" y="10" width="30" height="22" rx="11" fill="#ffb26b"/>
        <ellipse cx="20" cy="28" rx="9" ry="4.6" fill="#ffe3c4"/>
        <path d="M17 11 v3 M20 10.4 v3.6 M23 11 v3" stroke="#f59a4a" stroke-width="1.5" stroke-linecap="round"/>
        <g class="zp-eyes zp-open">${eye(14)}${eye(26)}</g>
        <g class="zp-eyes zp-happy">${arc(14, 22)}${arc(26, 22)}</g>
        <g class="zp-eyes zp-x"><path d="M11.8 19.2 l4.4 4.4 M16.2 19.2 l-4.4 4.4 M23.8 19.2 l4.4 4.4 M28.2 19.2 l-4.4 4.4" stroke="#2b2118" stroke-width="1.6" stroke-linecap="round"/></g>
        <g class="zp-eyes zp-sleep"><path d="M11.4 21.5 h5.2 M23.4 21.5 h5.2" stroke="#2b2118" stroke-width="1.6" stroke-linecap="round"/></g>
        <ellipse cx="9.6" cy="25.2" rx="2.6" ry="1.6" fill="#ff8aa0" opacity=".55"/><ellipse cx="30.4" cy="25.2" rx="2.6" ry="1.6" fill="#ff8aa0" opacity=".55"/>
        <path d="M18 24.6 q1 1.3 2 0 q1 1.3 2 0" fill="none" stroke="#2b2118" stroke-width="1.1" stroke-linecap="round"/>
      </g>
      <g class="zp-prop zp-p-zap">
        <rect x="31" y="22" width="5.4" height="11" rx="1.4" fill="#2a2a30"/><rect x="32" y="24.2" width="3.4" height="2.2" rx=".6" fill="#6cf"/>
        <path d="M32 22 v-2.4 M35.4 22 v-2.4" stroke="#aab" stroke-width="1.1" stroke-linecap="round"/><circle cx="33.7" cy="31.5" r="2.4" fill="#ffb26b"/>
        <g fill="none" stroke="#ffe14d" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">
          <path class="zp-bolt" d="M33.7 19 l-3 -2.5 l2.4 -.5 l-3.4 -3.6"/><path class="zp-bolt zp-b2" d="M6 14 l3.4 2 l-2 1.4 l4 3.2"/><path class="zp-bolt zp-b3" d="M2.5 26 l3.2 -1.6 l-.6 2.6 l3.2 -.8"/>
        </g>
      </g>
      <g class="zp-prop zp-p-gun">
        <rect x="28" y="14.5" width="10" height="4.4" rx="1.2" fill="#5ed16a"/><rect x="26.4" y="15.3" width="2.2" height="2.8" rx=".6" fill="#ffd23f"/>
        <rect x="34" y="18.9" width="3.4" height="5.6" rx="1.2" fill="#ffd23f"/><circle cx="35.7" cy="24.2" r="2.3" fill="#ffb26b"/>
      </g>
      <g class="zp-prop zp-p-oxy">
        <path d="M13.4 24 L6 20.5 M26.6 24 L34 20.5" stroke="#b9d9d0" stroke-width=".9" stroke-linecap="round"/>
        <path d="M20 29.6 q-1 4 -9 4.2 q-5 .2 -7 -3" fill="none" stroke="#e4f3ee" stroke-width="1.7" stroke-linecap="round"/>
        <g class="zp-mask"><path d="M13.4 24 q6.6 -4.8 13.2 0 q-1 6.2 -6.6 7.2 q-5.6 -1 -6.6 -7.2z" fill="#d8f0ff" fill-opacity=".65" stroke="#a9cfe0" stroke-width=".9"/>
          <ellipse cx="15.6" cy="25.6" rx="1.2" ry="2" fill="#3ec96a"/><ellipse cx="24.4" cy="25.6" rx="1.2" ry="2" fill="#3ec96a"/><circle class="zp-fog" cx="20" cy="27.6" r="2.4" fill="#fff"/></g>
      </g>
      <g class="zp-tears" fill="#5cc8ff">
        <rect class="zp-stream" x="13.3" y="23.4" width="1.5" height="9" rx=".75" opacity=".75"/><rect class="zp-stream zp-s2" x="25.2" y="23.4" width="1.5" height="9" rx=".75" opacity=".75"/>
        <path class="zp-tear" d="M11.6 23 q-1.4 2.6 0 3.2 q1.4 -.6 0 -3.2z"/><path class="zp-tear zp-t2" d="M28.4 23 q-1.4 2.6 0 3.2 q1.4 -.6 0 -3.2z"/>
        <ellipse class="zp-wail" cx="20" cy="26.4" rx="2.4" ry="2.2" fill="#7a2a2a"/>
      </g>
    </svg></div></div>`;
  document.documentElement.append(pet); // gắn vào <html> để React không bao giờ dọn
  const sprite = pet.querySelector(".zp-hop"), bubble = pet.querySelector(".zp-bubble"), flip = pet.querySelector(".zp-flip");
  const set = (c, on) => pet.classList.toggle(c, on);

  // ---- vùng sống ----
  // đang che tin nhắn (blur.js bật class zg-hide-* lên body) mà chuột không ở trong khung chat/dòng hội thoại và không có tin nào đang focus
  // (đúng lúc nội dung đang bị che) → Mochi phóng to giữa cửa sổ; rê chuột vào là thu nhỏ lại. Tắt được bằng tuỳ chọn "petbig" trong menu che.
  const BIG = 2.5; // bóng thoại to theo cùng hệ số này
  let big = false;
  const hiding = () => {
    const c = document.body.classList;
    if (!c.contains("zg-pet-big") || ![...c].some((n) => n.startsWith("zg-hide-"))) return false;
    // đang tương tác: rê vào chat/dòng hội thoại, menu che đang mở, tin focus bằng phím, hoặc con trỏ đang ở ô soạn tin
    return !document.querySelector("#chatViewContainer:hover, .conv-item:hover, .zg-msg-focus, #zg-menu.open") && !document.activeElement?.closest?.(".rich-input");
  };
  const GROW_DELAY = 800, SHRINK_DELAY = 150, ANIM = 900; // chờ trạng thái ổn định rồi mới đổi (hết giật); Mochi chạy ANIM ms
  let anim = false, since = 0, smallX = 0;
  const bigK = () => Math.min((innerHeight * .5) / H, (innerWidth * .7) / W);
  const placeBig = (k = bigK()) => {
    pet.style.top = (innerHeight - H * k) / 2 + "px"; pet.style.transform = `translateX(${(innerWidth - W * k) / 2}px)`;
  };
  const setSize = (k) => { pet.style.setProperty("--k", k); pet.style.width = W * k + "px"; pet.style.height = H * k + "px"; };
  // chạy từ chỗ này sang chỗ kia kèm phóng/thu: transition CSS (.zp-anim) lo phần nội suy, JS chỉ đặt đích
  const run = (go) => {
    anim = true; pet.style.transition = ""; set("zp-anim", true); set("zp-walk", true); bubble.classList.remove("zp-show");
    void pet.offsetWidth; go();
    setTimeout(() => { anim = false; set("zp-anim", false); set("zp-walk", false); }, ANIM);
  };
  const setBig = (on) => {
    big = on; set("zp-big", on);
    if (on) {
      smallX = x; reg = null; const k = bigK();
      face((innerWidth - W * k) / 2 > x ? 1 : -1);
      run(() => { setSize(k); placeBig(k); });
      setTimeout(() => big && say("Mình đang canh màn hình nè 👀 Rê chuột vào là mình tránh ra", 4000), ANIM + 200);
    } else {
      const n = region();
      if (!n) { setSize(1); pet.style.display = "none"; return; }
      reg = n; mode = n.mode; const to = Math.max(n.min, Math.min(n.max, smallX));
      face(to > (innerWidth - pet.offsetWidth) / 2 ? 1 : -1);
      run(() => { setSize(1); pet.style.top = n.y - H + "px"; pet.style.transform = `translateX(${to}px)`; x = to; });
    }
  };

  let reg = null, mode = "", x = 0, dir = 1, busy = false, asleep = false, lastAct = Date.now();
  const shown = (el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 40 || !r.height) return false;
    const t = document.elementFromPoint(r.left + 6, r.top + r.height / 2);
    return !!t && (el.contains(t) || pet.contains(t));
  };
  const region = () => {
    const bar = [...document.querySelectorAll(".chat-box-bar")].find(shown);
    if (bar) { const r = bar.getBoundingClientRect(); return { mode: "chat", min: r.left + 8, max: r.right - 8 - W, y: r.top + 1 }; }
    const fb = [...document.querySelectorAll(".msg-filters-bar")].find(shown);
    if (!fb) return null;
    const r = fb.getBoundingClientRect();
    const tabs = [...fb.querySelectorAll(".conv-tab")].map((t) => t.getBoundingClientRect().right);
    const from = (tabs.length ? Math.max(...tabs) : r.left) + 10;
    const dd = [...fb.querySelectorAll(".dd-lbl")].map((t) => t.getBoundingClientRect().left).filter((l) => l > from).sort((a, b) => a - b)[0];
    const to = (dd ?? r.right) - 10;
    return to - from < W + 20 ? null : { mode: "list", min: from, max: to - W, y: r.bottom - 1 };
  };
  const tick = () => {
    if (document.body.classList.contains("zg-pet-off")) { // tắt Mochi: ẩn và về trạng thái nhỏ, bật lại thì đặt lại chỗ như mới
      if (big) { big = false; set("zp-big", false); setSize(1); }
      anim = false; since = 0; reg = null; set("zp-anim", false); set("zp-walk", false); bubble.classList.remove("zp-show");
      pet.style.display = "none"; return;
    }
    if (anim) return;
    if (hiding() === big) since = 0;
    else if (!since) since = Date.now();
    else if (Date.now() - since >= (big ? SHRINK_DELAY : GROW_DELAY)) { since = 0; setBig(!big); return; }
    if (big) { pet.style.display = ""; placeBig(); return; }
    const n = region();
    if (!n) { reg = null; pet.style.display = "none"; return; }
    pet.style.display = "";
    pet.style.top = n.y - H + "px";
    if (!reg || reg.mode !== n.mode) { // đổi chỗ: đặt lại giữa vùng, không trượt
      mode = n.mode; reg = n;
      x = (n.min + n.max) / 2; pet.style.transition = "none"; pet.style.transform = `translateX(${x}px)`;
      pet.classList.remove("zp-in"); void pet.offsetWidth; pet.classList.add("zp-in");
    }
    reg = n;
    if (x > n.max || x < n.min) { x = Math.max(n.min, Math.min(n.max, x)); pet.style.transition = "transform .2s"; pet.style.transform = `translateX(${x}px)`; }
  };

  // ---- hành vi ----
  const face = (d) => { dir = d; flip.style.transform = d < 0 ? "scaleX(-1)" : ""; };
  const move = async (to, speed = SPEED) => {
    const dist = Math.abs(to - x), dur = dist / speed;
    if (dist < 4) return;
    face(to > x ? 1 : -1); set("zp-walk", true);
    pet.style.transition = `transform ${dur}s linear`; pet.style.transform = `translateX(${to}px)`; x = to;
    await wait(dur * 1000); set("zp-walk", false);
  };
  const hop = () => { sprite.classList.remove("zp-jump"); void sprite.offsetWidth; sprite.classList.add("zp-jump"); };
  let hideT = 0;
  const say = (text, ms = 3800) => {
    if (!text || (!reg && !big)) return;
    bubble.textContent = text; bubble.classList.add("zp-show");
    bubble.style.left = "0px"; // đo lại từ gốc rồi kẹp vào cửa sổ
    const b = bubble.getBoundingClientRect(), px = big ? (innerWidth - pet.offsetWidth) / 2 : x, pw = big ? pet.offsetWidth : W;
    const want = px + pw / 2 - b.width / 2, left = Math.max(8, Math.min(innerWidth - b.width - 8, want));
    bubble.style.left = left - px + "px";
    clearTimeout(hideT); hideT = setTimeout(() => bubble.classList.remove("zp-show"), ms);
  };
  // mấy trò bựa: bật class zp-g-<tên> (CSS lo hình + hiệu ứng), nói một câu, đứng yên ms rồi trả lại như cũ
  const GAGS = {
    zap: [3200, ["Chích điện cho tỉnh nè ⚡", "Bzzzt! Dậy làm việc đi ⚡", "Chích điện tự thức tỉnh: KPI +1 ⚡"]],
    gun: [4200, ["Cho nó sang cảm… à nhầm, cho mình nghỉ đi 🔫", "Kê súng nước vô đầu cho tỉnh táo 💦", "Còn 3 task nữa là mình xả súng… nước 🔫"]],
    oxy: [4500, ["Hít… thở… deadline… 😮‍💨", "Bình oxy để sống qua tuần này", "Cho mình thở tí, sắp tới giờ họp"]],
    cry: [4500, ["Huhu… task chưa xong 😭", "Khóc ròng vì sếp nhắn 'gấp' 😭😭", "Hức… mình chỉ muốn ăn cá thôi mà…"]],
    faint: [3500, ["Mình xỉu, báo sếp là mình đi viện 💀", "Tắt nguồn. Khởi động lại vào ngày mai", "x_x"]],
  };
  const gag = async (n = pick(Object.keys(GAGS))) => {
    if (busy || asleep || big || anim || !reg) return;
    busy = true; const [ms, lines] = GAGS[n];
    set("zp-gag", true); set("zp-g-" + n, true); say(pick(lines), ms - 300);
    await wait(ms);
    set("zp-gag", false); set("zp-g-" + n, false); hop(); busy = false;
  };
  const talking = () => bubble.classList.contains("zp-show");

  const sleep = (on) => {
    asleep = on; set("zp-asleep", on);
    if (on) { say("zZz… (đang họp trong mơ)", 6000); } else say("Hửm? Mình đâu có ngủ, mình đang suy nghĩ chiến lược 😤", 2500);
  };
  const activity = () => { lastAct = Date.now(); if (asleep) sleep(false); };
  ["mousemove", "mousedown", "keydown", "wheel"].forEach((t) => addEventListener(t, activity, { capture: true, passive: true }));

  // mắt dõi theo con trỏ
  let ray = 0, mx = 0, my = 0;
  addEventListener("mousemove", (e) => {
    mx = e.clientX; my = e.clientY;
    if (ray) return;
    ray = requestAnimationFrame(() => {
      ray = 0;
      const r = pet.getBoundingClientRect(), dx = mx - (r.left + r.width / 2), dy = my - (r.top + r.height / 2), d = Math.hypot(dx, dy) || 1;
      pet.style.setProperty("--lx", ((dx / d) * 1.3 * dir).toFixed(2));
      pet.style.setProperty("--ly", ((dy / d) * 1.1).toFixed(2));
    });
  }, { passive: true });

  // chọc
  let pokes = 0, pokeT = 0;
  sprite.addEventListener("click", async () => {
    pokes++; clearTimeout(pokeT); pokeT = setTimeout(() => (pokes = 0), 4000);
    if (pokes >= 5) {
      pokes = 0; busy = true; set("zp-mad", true); say(pick(MAD), 3000); hop();
      if (reg) await move(dir > 0 ? reg.min : reg.max, 130); // dỗi bỏ chạy sang đầu kia
      await wait(2500); set("zp-mad", false); busy = false;
    } else if (Math.random() < .5) gag();
    else { hop(); say(pick(LINES)); }
  });
  sprite.addEventListener("mouseenter", () => set("zp-joy", true));
  sprite.addEventListener("mouseleave", () => set("zp-joy", false));

  // thấy bạn đang gõ
  let lastType = 0;
  document.addEventListener("keydown", (e) => {
    if (e.metaKey || e.ctrlKey || e.altKey || !e.target.closest?.(".rich-input")) return;
    if (Date.now() - lastType > 25000 && Math.random() < .3) say(pick(TYPING), 2800);
    lastType = Date.now();
  }, true);

  // ---- vòng đời ----
  (async () => {
    say("Mochi đi làm rồi nè, chưa gì đã muốn về ✨", 3000);
    for (;;) {
      await wait(6000 + Math.random() * 12000); // ponytail: mỗi frame animation làm GPU vẽ lại cả cửa sổ kính (~7-15% GPU lúc đi) → thưa hành vi, đứng yên khi cửa sổ không focus
      if (!document.hasFocus() || !reg || big || anim || asleep || busy || talking()) continue;
      const r = Math.random();
      if (r < .45) await move(reg.min + Math.random() * (reg.max - reg.min));
      else if (r < .55) hop();
      else if (r < .8) await gag();
    }
  })();
  let lastMv = 0;
  addEventListener("mousemove", () => { const n = performance.now(); if (n - lastMv > 100) { lastMv = n; tick(); } }, { passive: true }); // tick đo layout + elementFromPoint nên không chạy theo từng sự kiện // thu nhỏ ngay khi rê chuột vào khung chat
  setInterval(() => {
    if (document.hidden) return;
    tick();
    if (!asleep && (reg || big) && Date.now() - lastAct > SLEEP_AFTER) sleep(true);
  }, 1000); // ponytail: tick đo layout + elementFromPoint; 200ms tốn ~13% CPU renderer lúc để yên, mousemove đã tick riêng cho phản hồi nhanh
  setInterval(() => { if (!asleep && (reg || big) && !busy && !talking() && Math.random() < .5) say(timeLine() || pick(LINES)); }, 90000);
  tick();
})();
