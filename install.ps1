# Có Node thì dùng Node; không thì chạy bằng chính Electron của Zalo — không cần cài gì thêm.
# Chạy:  powershell -ExecutionPolicy Bypass -File install.ps1 [--uninstall]
if (Get-Command node -ErrorAction SilentlyContinue) { & node "$PSScriptRoot\install.mjs" @args; exit $LASTEXITCODE }
$root = if ($env:ZALO_APP) { $env:ZALO_APP } else { "$env:LOCALAPPDATA\Programs\Zalo" }
$exe = Get-ChildItem $root -Recurse -Depth 2 -Filter Zalo.exe -ErrorAction SilentlyContinue | Sort-Object FullName -Descending | Select-Object -First 1
if (-not $exe) { Write-Error "Không tìm thấy Zalo. Đặt `$env:ZALO_APP=<thư mục cài Zalo>."; exit 1 }
$env:ELECTRON_RUN_AS_NODE = 1
& $exe.FullName "$PSScriptRoot\install.mjs" @args
exit $LASTEXITCODE
