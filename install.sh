#!/usr/bin/env bash
# Có Node thì dùng Node; không thì chạy bằng chính Electron của Zalo (ELECTRON_RUN_AS_NODE) — không cần cài gì thêm.
d=$(dirname "$0")
command -v node >/dev/null && exec node "$d/install.mjs" "$@"
if [ "$(uname)" = Darwin ]; then z=${ZALO_APP:-/Applications/Zalo.app}/Contents/MacOS/Zalo
else for r in "${ZALO_APP:-/opt/Zalo}" /opt/zalo /usr/lib/zalo; do z=$(find "$r" -maxdepth 3 -type f -iname zalo 2>/dev/null | head -1); [ -n "$z" ] && break; done; fi
[ -x "$z" ] || { echo "Không tìm thấy Zalo. Đặt ZALO_APP=<thư mục cài Zalo>." >&2; exit 1; }
ELECTRON_RUN_AS_NODE=1 exec "$z" "$d/install.mjs" "$@"
