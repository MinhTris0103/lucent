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
| `GLASS_JS` | Danh sách module JS bật, mặc định `"blur album keys ocr pet meet"` |
| `GLASS_TRANSPARENT=1` | Cửa sổ trong suốt (chỉ macOS, thử nghiệm) |

## Ghi chú

- OCR: macOS dùng Vision (cần Xcode Command Line Tools để biên dịch `ocr.swift`), Windows dùng `ocr.ps1`, Linux cần `tesseract` + `tesseract-ocr-vie`.
- Mới kiểm chứng đầy đủ trên macOS. Đường dẫn cài Zalo trên Windows/Linux là phỏng đoán, sai thì đặt `ZALO_APP`.
- Dự án không liên quan tới VNG/Zalo. Patch app của bên thứ ba: tự chịu rủi ro.
