// OCR bằng Vision của macOS (cùng engine với Live Text). Dùng: ocr <file ảnh> → JSON [{t, x, y, w, h}], toạ độ chuẩn hoá 0–1, gốc ở góc trên trái.
import Foundation
import ImageIO
import Vision

guard CommandLine.arguments.count > 1,
      let src = CGImageSourceCreateWithURL(URL(fileURLWithPath: CommandLine.arguments[1]) as CFURL, nil),
      let img = CGImageSourceCreateImageAtIndex(src, 0, nil) else { print("[]"); exit(0) }
// ảnh chụp từ điện thoại hay mang cờ xoay EXIF; Chromium đã xoay khi hiển thị nên Vision cũng phải xoay theo
let props = CGImageSourceCopyPropertiesAtIndex(src, 0, nil) as? [CFString: Any]
let orient = CGImagePropertyOrientation(rawValue: (props?[kCGImagePropertyOrientation] as? UInt32) ?? 1) ?? .up

let req = VNRecognizeTextRequest()
req.recognitionLevel = .accurate
req.usesLanguageCorrection = true
// Vision gọi tiếng Việt là "vi-VT" (không phải vi-VN); lọc theo tiền tố để khỏi hỏng khi Apple đổi mã
let have = (try? req.supportedRecognitionLanguages()) ?? []
req.recognitionLanguages = have.filter { $0.hasPrefix("vi") } + have.filter { $0.hasPrefix("en") }
try VNImageRequestHandler(cgImage: img, orientation: orient).perform([req])

let out: [[String: Any]] = (req.results ?? []).compactMap { o in
    guard let c = o.topCandidates(1).first else { return nil }
    let b = o.boundingBox
    return ["t": c.string, "x": b.minX, "y": 1 - b.maxY, "w": b.width, "h": b.height]
}
print(String(data: try JSONSerialization.data(withJSONObject: out), encoding: .utf8)!)
