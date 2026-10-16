# Lucent

Theme kính mờ (glassmorphism) cho Zalo PC trên macOS, Windows và Linux. Cài bằng cách chèn CSS/JS vào `app.asar` của Zalo, cùng cách với ZaDark. Không cần cài Node: nếu máy không có thì script chạy bằng chính Electron của Zalo.

## Cài đặt

Zalo đã cài sẵn. Script tự tắt Zalo, backup bản gốc vào `~/.zalo-glass-backup/<phiên bản>`, patch rồi mở lại.

```bash
./install.sh      # macOS / Linux
```

```powershell
powershell -ExecutionPolicy Bypass -File install.ps1   # Windows
```

Zalo tự cập nhật sẽ ghi đè bản patch, chỉ cần chạy lại script. Gỡ bằng `uninstall.sh` / `uninstall.ps1`.

## Tuỳ chọn (biến môi trường)

| Biến | Ý nghĩa |
|---|---|
| `ZALO_APP` | Thư mục cài Zalo, nếu không nằm ở chỗ mặc định |
| `GLASS_JS` | Danh sách module JS bật, mặc định `"blur album keys ocr pet meet"` (`templates` luôn được nạp đầu tiên) |
| `GLASS_TRANSPARENT=1` | Cửa sổ trong suốt (chỉ macOS, thử nghiệm) |

## Theme và pet (template)

Chọn trong app: nút con mắt ở sidebar → "Giao diện" (theme) và "Pet" (loại pet), đổi tức thì, lưu theo từng máy. Thêm template mới trong [theme/templates.js](theme/templates.js): theme là một mục trong `THEMES` (ghi đè biến `--zg-*`), pet là một mục trong `PETS` (gọi `fill(...)` đổi màu/tai/lời thoại, hoặc tự viết `svg` theo hợp đồng class `zp-*`).

Pet **Luffy Gear 5** là fan art SVG chibi với tóc trắng xoăn, vòng mây quanh vai, đai tím và dép. Chọn nút con mắt → "Pet" → "Luffy Gear 5"; pet có lời thoại tiếng Việt riêng và dùng các hành vi đi bộ, nhảy, vui, ngủ, khóc và hết pin có sẵn. Nếu đã cài Lucent, chạy lại script cài đặt từ bản mã nguồn có pet này rồi mở lại Zalo để thấy lựa chọn mới.

Luffy **tự đổi ngẫu nhiên sang một Gear khác mỗi 10 giây**, không cần giữ Shift: dạng thường (gọi Gear 1 cho tiện, mũ rơm và áo đỏ), Gear 2 (da ửng hồng, hơi nước), Gear 3 (tay khổng lồ), Gear 4 Boundman (thân bơm hơi, tóc dựng, Haki đen viền đỏ) hoặc Gear 5 (tóc trắng, vòng mây). Nếu đến hạn khi cửa sổ không có focus, pet bị ẩn, đang ngủ hoặc bận tung chiêu thì chờ tới khi hoạt động lại rồi đổi một lần; lượt tiếp theo tính sau đó 10 giây. Dạng Gear chỉ giữ trong phiên hiện tại; đổi pet rồi chọn lại hoặc mở lại Zalo sẽ về Gear 5, không đổi khoá lưu lựa chọn pet.

**Click thường vào Luffy để tung chiêu theo Gear hiện tại**: Pistol, Jet Gatling, Gigant Pistol, Kong Gun hoặc đòn cao su tự do Gear 5. Click sẽ thay thế gag khóc/hết pin đang diễn bằng chiêu; click dồn khi đang tung chiêu không khởi động lại hay chồng lượt. Chiêu kéo dài khoảng 2 giây, kèm lời thoại rồi trở lại bình thường. Luffy cũng có thể tự diễn gag khi rảnh; các pet khác giữ phản ứng click gốc.

**Shift + click Luffy** để đổi ngay sang một Gear khác ngẫu nhiên, kể cả khi đang tung chiêu. Mỗi lần đổi chủ động cũng bắt đầu lại mốc tự đổi 10 giây.

Đi bộ, nhảy, ngủ và lời thoại giữ cơ chế pet gốc: nghỉ 6–18 giây rồi chọn đi tới một vị trí ngẫu nhiên trong vùng (45%), nhảy (10%), diễn gag (25%) hoặc đứng yên (20%). Pet chỉ bắt đầu hành vi khi cửa sổ Zalo đang được dùng, không ngủ, không bận và không nói. Ngoài click, pet vẫn có thoại chào, thoại khi gõ, lúc ngủ/thức và 50% cơ hội nói mỗi 90 giây như bản gốc. **Đổi Gear không tự bật thoại và không ngắt bước đi.**

Tuỳ chọn giảm chuyển động của hệ điều hành tắt nhún và vung chiêu. Không có animation mới chạy khi đứng yên. Cài lại Lucent rồi mở lại Zalo để nạp bản mới.

Các dáng được vẽ lại thành SVG chibi, tham khảo [tư liệu Gear 4 trên ONE PIECE.com](https://one-piece.com/usop/o20160127_0511/index.html) và [mô hình Gear 5 của Bandai](https://gashapon.jp/products/detail.html?jan_code=4570118247285000); không tải ảnh hay gọi mạng khi pet chạy.

Các màn tung chiêu là bản diễn hoạt chibi tham khảo [Jet Gatling của Bandai](https://www.bandai.co.jp/candy/products/2010/625830.html), [Gigant Pistol](https://one-piece.com/anime/555/index.html) và [Kong Gun](https://one-piece.com/figure/o4617/index.html); đòn cao su Gear 5 là gag sáng tạo cho pet.

## Ghi chú

- OCR: macOS dùng Vision (cần Xcode Command Line Tools để biên dịch `ocr.swift`), Windows dùng `ocr.ps1`, Linux cần `tesseract` + `tesseract-ocr-vie`.
- Mới kiểm chứng đầy đủ trên macOS. Đường dẫn cài Zalo trên Windows/Linux là phỏng đoán, sai thì đặt `ZALO_APP`.
- Dự án không liên quan tới VNG/Zalo. Patch app của bên thứ ba: tự chịu rủi ro.
