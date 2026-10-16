// Dữ liệu template cho theme và pet + áp theme. Luôn nạp đầu tiên (install.mjs tự thêm), chạy cả ở cửa sổ viewer.
// Thêm theme: thêm một mục vào THEMES (chỉ cần ghi đè biến --zg-*). Thêm pet: gọi animal({...}) hoặc tự viết svg theo hợp đồng class zp-* (xem pet.css).
(() => {
  const KEY = "zg-tpl", DEF = { theme: "glass", pet: "mochi" };

  // ---- theme: biến màu ghi đè lên <html>; "glass" để trống = mặc định trong glass.css ----
  const THEMES = {
    glass: { name: "Glass (tím)", vars: {} },
    ocean: { name: "Đại dương", vars: {
      "--zg-accent": "56 189 248", "--zg-bg-d": "#050d16", "--zg-bg-l": "#eaf6fb",
      "--zg-d1": "rgba(14, 116, 255, 0.40)", "--zg-d2": "rgba(0, 200, 220, 0.30)", "--zg-d3": "rgba(60, 120, 255, 0.24)", "--zg-d4": "rgba(40, 220, 170, 0.18)", "--zg-d5": "rgba(80, 160, 255, 0.16)",
      "--zg-l1": "rgba(90, 170, 255, 0.42)", "--zg-l2": "rgba(70, 215, 240, 0.35)", "--zg-l3": "rgba(120, 150, 255, 0.28)", "--zg-l4": "rgba(90, 230, 190, 0.25)" } },
    sunset: { name: "Hoàng hôn", vars: {
      "--zg-accent": "255 138 76", "--zg-bg-d": "#14080a", "--zg-bg-l": "#fbf0ea",
      "--zg-d1": "rgba(255, 90, 60, 0.38)", "--zg-d2": "rgba(255, 170, 40, 0.26)", "--zg-d3": "rgba(255, 60, 130, 0.28)", "--zg-d4": "rgba(200, 60, 200, 0.18)", "--zg-d5": "rgba(255, 120, 90, 0.16)",
      "--zg-l1": "rgba(255, 140, 100, 0.42)", "--zg-l2": "rgba(255, 200, 90, 0.35)", "--zg-l3": "rgba(255, 120, 170, 0.32)", "--zg-l4": "rgba(230, 150, 230, 0.25)" } },
    forest: { name: "Rừng", vars: {
      "--zg-accent": "74 222 128", "--zg-bg-d": "#06100a", "--zg-bg-l": "#ecf7ee",
      "--zg-d1": "rgba(30, 190, 100, 0.34)", "--zg-d2": "rgba(120, 220, 60, 0.22)", "--zg-d3": "rgba(0, 170, 150, 0.26)", "--zg-d4": "rgba(200, 220, 60, 0.14)", "--zg-d5": "rgba(60, 200, 120, 0.16)",
      "--zg-l1": "rgba(90, 210, 130, 0.42)", "--zg-l2": "rgba(170, 225, 90, 0.35)", "--zg-l3": "rgba(70, 200, 190, 0.30)", "--zg-l4": "rgba(210, 230, 110, 0.25)" } },
  };

  // ---- pet ----
  // Hợp đồng sprite (viewBox 40×36): .zp-body .zp-tail .zp-leg-a/.zp-leg-b .zp-pupil, bốn bộ mắt .zp-eyes + .zp-open/.zp-happy/.zp-x/.zp-sleep,
  // đạo cụ cho gag .zp-p-zap/.zp-p-gun/.zp-p-oxy và .zp-tears. Thiếu phần tử nào thì gag/hiệu ứng tương ứng chỉ là không hiện.
  const eye = (cx) => `<circle cx="${cx}" cy="21" r="2.6" fill="#2b2118"/><circle class="zp-pupil" cx="${cx - .7}" cy="20.2" r=".9" fill="#fff"/>`;
    const arc = (cx, d) => `<path d="M${cx - 2.6} ${d} q2.6 -3.4 5.2 0" fill="none" stroke="#2b2118" stroke-width="1.6" stroke-linecap="round"/>`;
  
  const animal = (p) => ({ ...p, svg: `
      <path class="zp-tail" d="M33 28 q8 -2 5 -11" fill="none" stroke="${p.dark}" stroke-width="3.4" stroke-linecap="round"/>
      <rect class="zp-leg zp-leg-a" x="10" y="30" width="6" height="5" rx="2.5" fill="${p.dark}"/>
      <rect class="zp-leg zp-leg-b" x="24" y="30" width="6" height="5" rx="2.5" fill="${p.dark}"/>
      <g class="zp-body">
        ${p.ears(p)}
        <rect x="5" y="10" width="30" height="22" rx="11" fill="${p.fur}"/>
        <ellipse cx="20" cy="28" rx="9" ry="4.6" fill="${p.belly}"/>
        ${p.mark(p)}
        <g class="zp-eyes zp-open">${eye(14)}${eye(26)}</g>
        <g class="zp-eyes zp-happy">${arc(14, 22)}${arc(26, 22)}</g>
        <g class="zp-eyes zp-x"><path d="M11.8 19.2 l4.4 4.4 M16.2 19.2 l-4.4 4.4 M23.8 19.2 l4.4 4.4 M28.2 19.2 l-4.4 4.4" stroke="#2b2118" stroke-width="1.6" stroke-linecap="round"/></g>
        <g class="zp-eyes zp-sleep"><path d="M11.4 21.5 h5.2 M23.4 21.5 h5.2" stroke="#2b2118" stroke-width="1.6" stroke-linecap="round"/></g>
        <ellipse cx="9.6" cy="25.2" rx="2.6" ry="1.6" fill="${p.cheek}" opacity=".55"/><ellipse cx="30.4" cy="25.2" rx="2.6" ry="1.6" fill="${p.cheek}" opacity=".55"/>
        <path d="M18 24.6 q1 1.3 2 0 q1 1.3 2 0" fill="none" stroke="#2b2118" stroke-width="1.1" stroke-linecap="round"/>
      </g>
      <g class="zp-prop zp-p-zap">
        <rect x="31" y="22" width="5.4" height="11" rx="1.4" fill="#2a2a30"/><rect x="32" y="24.2" width="3.4" height="2.2" rx=".6" fill="#6cf"/>
        <path d="M32 22 v-2.4 M35.4 22 v-2.4" stroke="#aab" stroke-width="1.1" stroke-linecap="round"/><circle cx="33.7" cy="31.5" r="2.4" fill="${p.fur}"/>
        <g fill="none" stroke="#ffe14d" stroke-width="1.4" stroke-linejoin="round" stroke-linecap="round">
          <path class="zp-bolt" d="M33.7 19 l-3 -2.5 l2.4 -.5 l-3.4 -3.6"/><path class="zp-bolt zp-b2" d="M6 14 l3.4 2 l-2 1.4 l4 3.2"/><path class="zp-bolt zp-b3" d="M2.5 26 l3.2 -1.6 l-.6 2.6 l3.2 -.8"/>
        </g>
      </g>
      <g class="zp-prop zp-p-gun">
        <rect x="28" y="14.5" width="10" height="4.4" rx="1.2" fill="#5ed16a"/><rect x="26.4" y="15.3" width="2.2" height="2.8" rx=".6" fill="#ffd23f"/>
        <rect x="34" y="18.9" width="3.4" height="5.6" rx="1.2" fill="#ffd23f"/><circle cx="35.7" cy="24.2" r="2.3" fill="${p.fur}"/>
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
    ` });
  const CAT_EARS = (p) => `<path d="M8.5 15 L10.5 3.5 L18.5 12Z M31.5 15 L29.5 3.5 L21.5 12Z" fill="${p.fur}" stroke="${p.fur}" stroke-width="2" stroke-linejoin="round"/>
        <path d="M11.2 11.5 L11.8 7 L15 10.4Z M28.8 11.5 L28.2 7 L25 10.4Z" fill="${p.inner}"/>`;
  const BUNNY_EARS = (p) => `<rect x="10.5" y="-7" width="7" height="19" rx="3.5" fill="${p.fur}"/><rect x="22.5" y="-7" width="7" height="19" rx="3.5" fill="${p.fur}"/>
        <rect x="12.2" y="-4" width="3.6" height="13" rx="1.8" fill="${p.inner}"/><rect x="24.2" y="-4" width="3.6" height="13" rx="1.8" fill="${p.inner}"/>`;
  const STRIPES = (p) => `<path d="M17 11 v3 M20 10.4 v3.6 M23 11 v3" stroke="${p.dark}" stroke-width="1.5" stroke-linecap="round"/>`;
  // ponytail: gag (CSS đạo cụ) dùng chung; mỗi pet chỉ đổi lời thoại. Muốn gag riêng thì thêm css + tên mới vào gags của pet đó.
  const GAGS = {
    zap: [3200, ["Chích điện cho tỉnh nè ⚡", "Bzzzt! Dậy làm việc đi ⚡", "Chích điện tự thức tỉnh: KPI +1 ⚡"]],
    gun: [4200, ["Cho nó sang cảm… à nhầm, cho mình nghỉ đi 🔫", "Kê súng nước vô đầu cho tỉnh táo 💦", "Còn 3 task nữa là mình xả súng… nước 🔫"]],
    oxy: [4500, ["Hít… thở… deadline… 😮‍💨", "Bình oxy để sống qua tuần này", "Cho mình thở tí, sắp tới giờ họp"]],
    cry: [4500, ["Huhu… task chưa xong 😭", "Khóc ròng vì sếp nhắn 'gấp' 😭😭", "Hức… mình chỉ muốn ăn cá thôi mà…"]],
    faint: [3500, ["Mình xỉu, báo sếp là mình đi viện 💀", "Tắt nguồn. Khởi động lại vào ngày mai", "x_x"]],
  };
  const TYPING = ["Ồ, đang gõ gì đó… gõ nhanh coi, mình đói", "Viết gì mà dài thế 😳 báo cáo hay tâm sự?", "Mình không nhìn trộm đâu, thề! (nhìn chằm chằm)", "Gõ đi gõ đi, mình đợi, mình có cả ngày 🍿", "Gõ rồi xoá, gõ rồi xoá… biết rồi nha 🤭"];
  const MAD = ["Thôi nha! Mình giận á 😾", "Chọc nữa là mình nghỉ việc đó!", "Hứ! Mình đi nộp đơn xin nghỉ đây", "Đủ rồi, mình lên HR báo cáo bạn 📋"];
  const fill = (n, p, l) => ({ ...animal(p), name: n, typing: TYPING, mad: MAD, gags: GAGS, ...l });

  const PETS = {
    mochi: fill("Mochi", { fur: "#ffb26b", dark: "#f59a4a", belly: "#ffe3c4", inner: "#ff9fb0", cheek: "#ff8aa0", ears: CAT_EARS, mark: STRIPES }, {
      intro: "Mochi đi làm rồi nè, chưa gì đã muốn về ✨",
      lines: [
        "Người ta đặt vé về quê ăn lễ, còn mình đặt niềm tin sẽ xong KPI tuần này 🙏", "Tạm gác cuộc đời nô lệ tư bản, ê hề lô 🐥", "Hết ngày mai nữa là phải làm nô lệ cho… à mà nay cũng đang làm rồi 🥲",
        "Cảm xúc chạy task của nô lệ tư bản: 🙂😐🙃💀", "Mình thở bằng bình oxy để sống sót qua deadline 😮‍💨", "Nhắn nhanh đi, mình đói rồi 🍙",
        "Đừng chọc nữa, nhột! Mình đang bận… ngồi không", "Reply người ta đi, để lâu mất duyên, mất luôn khách đó", "Uống nước chưa? Chưa thì uống, rồi thì uống nữa 💧",
        "Meo. (dịch: sếp ơi cho em nghỉ)", "Mình không lười, mình tiết kiệm năng lượng cho deadline 🔋", "Ai nhắn mà im re vậy ta… seen rồi bỏ mình hả 😭",
        "Cho mình xin cá khô, không có lương thì có cá 🐟", "Ngồi lâu rồi, đứng dậy vươn vai đi kẻo thành hoá thạch 🦴", "Hứ, mình đâu có quan tâm đâu 😼 (có đó)",
        "Họp xong cuộc họp để lên lịch cuộc họp tiếp theo 📅", "Task xong 99%. 1% còn lại là cả cuộc đời", "Hôm nay mình làm việc rất chăm: nằm nghĩ về việc phải làm",
        "Cà phê là nhiên liệu, drama là gia vị ☕", "Sếp nhắn 'em rảnh không?' là mình tim ngừng 3 nhịp 💔", "Mình chỉ là con mèo, mà áp lực như con người 🐱",
      ] }),
    mun: fill("Mun", { fur: "#9aa3b2", dark: "#7d8697", belly: "#e3e7ee", inner: "#ffb3c1", cheek: "#ff9db0", ears: CAT_EARS, mark: STRIPES }, {
      intro: "Mun có mặt. Đừng hỏi gì cả 😑",
      lines: ["Mun không nói nhiều. Mun chỉ nhìn 😑", "Việc hôm nay để mai, mai để kia, kia để… mốt", "Đừng reply vội, cho người ta tưởng bạn bận 😎", "Sạc pin xong rồi, giờ tới lượt xả",
        "Cà phê đâu? Không có thì Mun đình công ☕", "Mun thấy bạn lướt rồi nha, làm việc đi", "Đời là một chuỗi họp không cần thiết", "Meo (nghĩa là: kệ đi)"] }),
    bong: fill("Bông", { fur: "#f7d9e6", dark: "#e9b9cf", belly: "#fff3f8", inner: "#ff9fb8", cheek: "#ff8aa8", ears: BUNNY_EARS, mark: () => "" }, {
      intro: "Bông tới rồi nè, mang theo cà rốt 🥕",
      lines: ["Nhảy một cái cho tỉnh táo nào 🐰", "Cà rốt là động lực, deadline là… cà rốt hết hạn", "Bông không trốn việc, Bông chỉ nhảy đi chỗ khác thôi", "Nhắn lại người ta đi, đừng để họ chờ như cà rốt héo",
        "Uống nước nha, Bông nhắc đó 💧", "Làm tí nghỉ tí, sống lâu như thỏ (tầm 10 năm)", "Tai Bông nghe hết, nhưng Bông giả vờ không nghe 🙉", "Ăn rau chưa? Chưa thì ăn đi 🥬"] }),
  };

  // ---- chọn + áp dụng ----
  const load = () => { try { return { ...DEF, ...JSON.parse(localStorage.getItem(KEY)) }; } catch { return { ...DEF }; } };
  const keys = [...new Set(Object.values(THEMES).flatMap((t) => Object.keys(t.vars)))];
  const apply = () => {
    const s = load(), t = THEMES[s.theme] || THEMES.glass, root = document.documentElement.style;
    keys.forEach((k) => root.removeProperty(k));
    Object.entries(t.vars).forEach(([k, v]) => root.setProperty(k, v));
    dispatchEvent(new Event("zg-tpl"));
  };
  const zg = globalThis.__zg = { THEMES, PETS, get: () => load(), set: (k, v) => { try { localStorage.setItem(KEY, JSON.stringify({ ...load(), [k]: v })); } catch {} apply(); } };
  zg.pet = () => PETS[load().pet] || PETS.mochi;
  addEventListener("storage", (e) => e.key === KEY && apply()); // cửa sổ khác đổi → theo
  apply();
})();
