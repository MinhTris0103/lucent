# Có Node thì dùng Node; không thì chạy bằng chính Electron của Zalo — không cần cài gì thêm.
# Chạy:  powershell -ExecutionPolicy Bypass -File install.ps1 [--uninstall]
if (Get-Command node -ErrorAction SilentlyContinue) { & node "$PSScriptRoot\install.mjs" @args; exit $LASTEXITCODE }
$root = if ($env:ZALO_APP) { $env:ZALO_APP } else { "$env:LOCALAPPDATA\Programs\Zalo" }
# Zalo.exe ở thư mục gốc chỉ là launcher; Electron nằm trong Zalo-<phiên bản>\ (lấy bản mới nhất)
$exe = @($root) + (Get-ChildItem $root -Directory -Filter 'Zalo-*' -ErrorAction SilentlyContinue | Sort-Object { [version]($_.Name -replace '^Zalo-', '') } -Descending | % FullName) |
  ? { Test-Path "$_\resources\app.asar" } | % { "$_\Zalo.exe" } | Select-Object -First 1
if (-not $exe) { Write-Error "Không tìm thấy Zalo. Đặt `$env:ZALO_APP=<thư mục cài Zalo>."; exit 1 }
$env:ELECTRON_RUN_AS_NODE = 1
# Zalo.exe là app GUI: gọi thẳng bằng & thì PowerShell không chờ và mất output, nên dùng Start-Process -Wait
$p = Start-Process $exe -ArgumentList (@("`"$PSScriptRoot\install.mjs`"") + $args) -Wait -PassThru -NoNewWindow
exit $p.ExitCode
