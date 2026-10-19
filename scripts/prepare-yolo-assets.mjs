import { createHash } from "node:crypto";
import { copyFile, mkdir, readFile, stat, writeFile } from "node:fs/promises";
import { join } from "node:path";

const modelUrl = "https://github.com/ultralytics/assets/releases/download/v8.3.0/yolo11n-pose.onnx";
const modelSha256 = "93e2866b0ce678f99b4dd88af0c12e9ea2edf079a361dc2ecbc6226b77ff6408";
const modelDir = join(process.cwd(), "public", "models");
const runtimeDir = join(process.cwd(), "public", "ort");
const modelPath = join(modelDir, "yolo11n-pose.onnx");
const runtimeSource = join(process.cwd(), "node_modules", "onnxruntime-web", "dist");
const runtimeFiles = [
  "ort.webgpu.min.js",
  "ort.wasm.min.js",
  "ort-wasm-simd-threaded.jsep.mjs",
  "ort-wasm-simd-threaded.jsep.wasm",
  "ort-wasm-simd-threaded.mjs",
  "ort-wasm-simd-threaded.wasm",
];

await mkdir(modelDir, { recursive: true });
await mkdir(runtimeDir, { recursive: true });

let needsModel = true;
try {
  needsModel = (await stat(modelPath)).size < 10_000_000;
} catch {}

if (needsModel) {
  const response = await fetch(modelUrl, { redirect: "follow" });
  if (!response.ok) throw new Error(`Unable to download YOLO model: ${response.status}`);
  await writeFile(modelPath, Buffer.from(await response.arrayBuffer()));
}

const checksum = createHash("sha256").update(await readFile(modelPath)).digest("hex");
if (checksum !== modelSha256) throw new Error("YOLO model checksum did not match the approved asset.");

for (const file of runtimeFiles) await copyFile(join(runtimeSource, file), join(runtimeDir, file));

console.log("YOLO browser assets are ready.");
