# SVG to 4K MP4 Converter

> Convert vector animations and standalone SVGs into crisp, high-resolution 4K MP4 (H.264) videos entirely in the browser. Zero server uploads, zero cost, completely private.

🔗 **Live Tool:** [https://svg-to-4k-mp4.vercel.app/](https://svg-to-4k-mp4.vercel.app/)

---

## 🚀 Key Features

- **True 4K Ultra HD Export:** Scales scalable vector graphics up to 3840×2160 resolution without pixelation or quality loss.
- **100% Client-Side Processing:** Powered by HTML5 Canvas, WebGL, and browser-native MediaRecorder. Files never leave your local device.
- **Customizable Output:** Choose custom aspect ratios (16:9 widescreen, 9:16 vertical reels/shorts), framerates (30fps / 60fps), and duration.
- **Stock Contributor Ready:** Built to export high-bitrate MP4 clips tailored for commercial microstock platforms like Adobe Stock, Shutterstock, and Freepik.

---

## 🛠️ Tech Stack

- **Frontend:** Next.js / Static HTML & Vanilla JS
- **Rendering Engine:** HTML5 Canvas API & WebGL
- **Encoding:** MediaRecorder API / WebCodecs (Client-side MP4 muxing)
- **Deployment:** Vercel Edge Network

---

## 📖 How It Works

1. **Upload:** Drag and drop any valid `.svg` file.
2. **Configure:** Set canvas resolution (1080p, 2K, 4K), background color, duration (seconds), and frame rate.
3. **Render & Record:** The browser rasterizes the vector frames dynamically at native 4K dimensions.
4. **Download:** Export your clean `.mp4` video instantly.

---

## 🔒 Privacy & Security

No backend servers or cloud conversion APIs are involved. All rasterization and video encoding occur directly inside your browser's local memory sandbox.

---

## 📄 License

MIT License. Open for personal and commercial usage.
