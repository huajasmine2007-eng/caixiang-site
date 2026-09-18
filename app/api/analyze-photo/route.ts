import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const RATE_WINDOW_MS = 15 * 60 * 1000;
const RATE_LIMIT = 6;
const allowedTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

type RateRecord = { count: number; resetAt: number };
const globalRateStore = globalThis as typeof globalThis & { caixiangVisionRate?: Map<string, RateRecord> };
const rateStore = globalRateStore.caixiangVisionRate ?? new Map<string, RateRecord>();
globalRateStore.caixiangVisionRate = rateStore;

function json(body: unknown, status = 200) {
  return NextResponse.json(body, { status, headers: { "Cache-Control": "no-store, max-age=0" } });
}

function sameOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  try { return new URL(origin).host === request.headers.get("host"); } catch { return false; }
}

function withinRateLimit(request: NextRequest) {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  const key = forwarded || "unknown";
  const now = Date.now();
  const current = rateStore.get(key);
  if (!current || current.resetAt <= now) { rateStore.set(key, { count: 1, resetAt: now + RATE_WINDOW_MS }); return true; }
  if (current.count >= RATE_LIMIT) return false;
  current.count += 1;
  return true;
}

function getOutputText(payload: unknown) {
  if (!payload || typeof payload !== "object") return null;
  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return null;
  for (const item of output) {
    const content = item && typeof item === "object" ? (item as { content?: unknown }).content : null;
    if (!Array.isArray(content)) continue;
    for (const part of content) if (part && typeof part === "object" && (part as { type?: string }).type === "output_text" && typeof (part as { text?: unknown }).text === "string") return (part as { text: string }).text;
  }
  return null;
}

export async function POST(request: NextRequest) {
  if (!sameOrigin(request)) return json({ error: "신뢰할 수 없는 요청입니다." }, 403);
  if (!withinRateLimit(request)) return json({ error: "요청이 너무 많습니다. 잠시 후 다시 시도해 주세요." }, 429);

  const apiKey = process.env.OPENAI_API_KEY;
  const enabled = process.env.ENABLE_VISION_ANALYSIS === "true";
  if (!apiKey || !enabled) return json({ available: false, reason: "vision_not_configured" }, 503);

  let formData: FormData;
  try { formData = await request.formData(); } catch { return json({ error: "사진을 불러올 수 없습니다." }, 400); }
  const image = formData.get("image");
  if (!(image instanceof File)) return json({ error: "사진 한 장을 선택해 주세요." }, 400);
  if (!allowedTypes.has(image.type)) return json({ error: "JPG, PNG 또는 WebP 형식만 지원합니다." }, 415);
  if (image.size <= 0 || image.size > MAX_IMAGE_BYTES) return json({ error: "사진 크기는 8MB 이하여야 합니다." }, 413);

  const base64 = Buffer.from(await image.arrayBuffer()).toString("base64");
  const model = process.env.OPENAI_VISION_MODEL || "gpt-4o-mini";
  const schema = {
    type: "object",
    additionalProperties: false,
    required: ["photo_quality", "appearance", "confidence"],
    properties: {
      photo_quality: {
        type: "object", additionalProperties: false,
        required: ["face_count", "full_face_visible", "wearing_glasses", "frontal_pose", "lighting", "blur", "filter_suspected", "pass", "retake_reasons"],
        properties: {
          face_count: { type: "integer", minimum: 0, maximum: 5 },
          full_face_visible: { type: "boolean" }, wearing_glasses: { type: "boolean" }, frontal_pose: { type: "boolean" },
          lighting: { type: "string", enum: ["good", "too_dark", "too_bright", "color_cast"] },
          blur: { type: "string", enum: ["none", "mild", "severe"] }, filter_suspected: { type: "boolean" }, pass: { type: "boolean" },
          retake_reasons: { type: "array", maxItems: 5, items: { type: "string" } }
        }
      },
      appearance: {
        type: "object", additionalProperties: false,
        required: ["undertone", "value", "chroma", "contrast"],
        properties: {
          undertone: { type: "string", enum: ["warm", "cool", "neutral"] }, value: { type: "string", enum: ["light", "medium", "deep"] },
          chroma: { type: "string", enum: ["clear", "medium", "soft"] }, contrast: { type: "string", enum: ["low", "medium", "high"] }
        }
      },
      confidence: { type: "number", minimum: 0, maximum: 1 }
    }
  };

  const upstream = await fetch("https://api.openai.com/v1/responses", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      model, store: false, max_output_tokens: 800,
      input: [{ role: "user", content: [
        { type: "input_text", text: "퍼스널 컬러 진단용 사진을 확인하세요. 촬영 품질과 눈에 보이는 색상 특징만 분석하세요. 신원, 나이, 인종, 건강, 성격 또는 매력도를 추론하지 마세요. 통과 기준: 정면 얼굴이 정확히 한 명이고 이마와 턱이 모두 보이며, 안경이나 선글라스를 착용하지 않았고, 뚜렷한 필터 없이 조명이 고르고 사진이 선명해야 합니다. retake_reasons는 한국어로 작성하세요." },
        { type: "input_image", image_url: `data:${image.type};base64,${base64}`, detail: "high" }
      ] }],
      text: { format: { type: "json_schema", name: "caixiang_photo_analysis", strict: true, schema } }
    })
  });

  if (!upstream.ok) return json({ error: "사진 분석을 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해 주세요." }, 502);
  const payload: unknown = await upstream.json();
  const outputText = getOutputText(payload);
  if (!outputText) return json({ error: "사진 분석에서 유효한 결과를 받지 못했습니다." }, 502);
  try { return json({ available: true, analysis: JSON.parse(outputText) }); } catch { return json({ error: "사진 분석 결과 형식에 오류가 있습니다." }, 502); }
}
