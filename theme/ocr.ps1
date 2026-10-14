# OCR bằng Windows.Media.Ocr (có sẵn trong Windows 10+). Dùng: powershell -File ocr.ps1 <file ảnh> → JSON [{t,x,y,w,h}] chuẩn hoá 0–1, gốc góc trên trái (cùng định dạng ocr.swift).
param([string]$Path)
$ErrorActionPreference = 'Stop'
Add-Type -AssemblyName System.Runtime.WindowsRuntime
$types = 'Windows.Storage.StorageFile,Windows.Storage', 'Windows.Storage.Streams.IRandomAccessStream,Windows.Storage.Streams',
  'Windows.Graphics.Imaging.BitmapDecoder,Windows.Graphics.Imaging', 'Windows.Graphics.Imaging.SoftwareBitmap,Windows.Graphics.Imaging',
  'Windows.Media.Ocr.OcrEngine,Windows.Media.Ocr', 'Windows.Globalization.Language,Windows.Globalization'
foreach ($t in $types) { $null = Invoke-Expression "[$($t.Split(',')[0]),$($t.Split(',')[1]),ContentType=WindowsRuntime]" }
$asTask = ([System.WindowsRuntimeSystemExtensions].GetMethods() | Where-Object { $_.Name -eq 'AsTask' -and $_.GetParameters().Count -eq 1 -and $_.GetParameters()[0].ParameterType.Name -eq 'IAsyncOperation`1' })[0]
function Await($op, [Type]$t) { $task = $asTask.MakeGenericMethod($t).Invoke($null, @($op)); $null = $task.Wait(-1); $task.Result }

$file = Await ([Windows.Storage.StorageFile]::GetFileFromPathAsync($Path)) ([Windows.Storage.StorageFile])
$stream = Await ($file.OpenAsync([Windows.Storage.FileAccessMode]::Read)) ([Windows.Storage.Streams.IRandomAccessStream])
$dec = Await ([Windows.Graphics.Imaging.BitmapDecoder]::CreateAsync($stream)) ([Windows.Graphics.Imaging.BitmapDecoder])
# tiếng Việt cần cài gói ngôn ngữ; không có thì dùng ngôn ngữ của hồ sơ người dùng
$eng = [Windows.Media.Ocr.OcrEngine]::TryCreateFromLanguage((New-Object Windows.Globalization.Language 'vi'))
if (-not $eng) { $eng = [Windows.Media.Ocr.OcrEngine]::TryCreateFromUserProfileLanguages() }
if (-not $eng) { '[]'; exit 0 }
# ảnh lớn hơn MaxImageDimension thì thu nhỏ; ExifOrientation theo Chromium (ảnh điện thoại)
$w = $dec.OrientedPixelWidth; $h = $dec.OrientedPixelHeight
$k = [Math]::Min(1.0, [Windows.Media.Ocr.OcrEngine]::MaxImageDimension / [Math]::Max($w, $h))
$tf = New-Object Windows.Graphics.Imaging.BitmapTransform
if ($k -lt 1) { $tf.ScaledWidth = [uint32]($dec.PixelWidth * $k); $tf.ScaledHeight = [uint32]($dec.PixelHeight * $k) }
$bmp = Await ($dec.GetSoftwareBitmapAsync([Windows.Graphics.Imaging.BitmapPixelFormat]::Bgra8, [Windows.Graphics.Imaging.BitmapAlphaMode]::Premultiplied, $tf, [Windows.Graphics.Imaging.ExifOrientationMode]::RespectExifOrientation, [Windows.Graphics.Imaging.ColorManagementMode]::DoNotColorManage)) ([Windows.Graphics.Imaging.SoftwareBitmap])
$res = Await ($eng.RecognizeAsync($bmp)) ([Windows.Media.Ocr.OcrResult])
$W = $bmp.PixelWidth; $H = $bmp.PixelHeight
$out = foreach ($l in $res.Lines) {
  $x0 = ($l.Words | ForEach-Object { $_.BoundingRect.X } | Measure-Object -Minimum).Minimum
  $y0 = ($l.Words | ForEach-Object { $_.BoundingRect.Y } | Measure-Object -Minimum).Minimum
  $x1 = ($l.Words | ForEach-Object { $_.BoundingRect.X + $_.BoundingRect.Width } | Measure-Object -Maximum).Maximum
  $y1 = ($l.Words | ForEach-Object { $_.BoundingRect.Y + $_.BoundingRect.Height } | Measure-Object -Maximum).Maximum
  [pscustomobject]@{ t = $l.Text; x = $x0 / $W; y = $y0 / $H; w = ($x1 - $x0) / $W; h = ($y1 - $y0) / $H } | ConvertTo-Json -Compress
}
[Console]::OutputEncoding = New-Object System.Text.UTF8Encoding $false
'[' + (@($out) -join ',') + ']'
