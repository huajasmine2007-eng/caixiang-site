import type { YOLO } from "@ultralytics/yolo";

export type PhotoKind = "color_face" | "full_body" | "face_front" | "face_left" | "face_right";

export type YoloPhotoCheck = {
  status: "pass" | "warning" | "fail";
  allowUpload: boolean;
  personCount: number;
  confidence?: number;
  messageKo: string;
  messageZh: string;
};

let modelPromise: Promise<YOLO> | null = null;

async function getModel() {
  if (!modelPromise) {
    modelPromise = import("@ultralytics/yolo").then(({ YOLO }) =>
      YOLO.load("/models/yolo11n-pose.onnx", {
        device: "auto",
        ortBaseUrl: `${window.location.origin}/ort/`,
      }),
    );
  }
  return modelPromise;
}

function isVisible(points: Array<[number, number, number]>, index: number, threshold = 0.35) {
  return (points[index]?.[2] ?? 0) >= threshold;
}

export async function checkPhotoWithYolo(file: File, kind: PhotoKind): Promise<YoloPhotoCheck> {
  const model = await getModel();
  const result = await model.predict(file, { classes: [0], conf: 0.25, iou: 0.65 });
  const people = result.boxes.filter((box) => box.cls === 0 || box.name.toLowerCase() === "person");

  if (people.length > 1) {
    return {
      status: "fail",
      allowUpload: false,
      personCount: people.length,
      messageKo: `${people.length}명이 감지됐어요. 한 사람만 나오도록 다시 촬영해 주세요.`,
      messageZh: `YOLO 检测到 ${people.length} 人，请只保留一人重新拍摄。`,
    };
  }

  if (kind === "full_body") {
    if (people.length !== 1) {
      return {
        status: "fail",
        allowUpload: false,
        personCount: 0,
        messageKo: "전신 인물을 찾지 못했어요. 밝은 곳에서 머리부터 발끝까지 촬영해 주세요.",
        messageZh: "YOLO 未检测到完整人物，请在明亮环境中拍到头顶至脚底。",
      };
    }

    const points = result.keypoints[0]?.points ?? [];
    const upperBodyVisible = [0, 5, 6, 11, 12].filter((index) => isVisible(points, index)).length >= 4;
    const legsVisible = [13, 14, 15, 16].filter((index) => isVisible(points, index, 0.3)).length >= 3;
    const box = people[0];
    const heightRatio = (box.y2 - box.y1) / Math.max(result.height, 1);

    if (!upperBodyVisible || !legsVisible || heightRatio < 0.45) {
      return {
        status: "fail",
        allowUpload: false,
        personCount: 1,
        confidence: box.conf,
        messageKo: "전신이 완전히 보이지 않아요. 머리와 발이 잘리지 않도록 조금 멀리서 촬영해 주세요.",
        messageZh: "YOLO 判断全身不完整，请后退一些，确保头顶、肩胯、膝盖和双脚入镜。",
      };
    }

    return {
      status: "pass",
      allowUpload: true,
      personCount: 1,
      confidence: box.conf,
      messageKo: "한 명의 전신과 주요 관절이 확인됐어요.",
      messageZh: "YOLO 已确认单人全身及主要身体关键点。",
    };
  }

  if (people.length === 1) {
    const points = result.keypoints[0]?.points ?? [];
    const visibleFacePoints = [0, 1, 2, 3, 4].filter((index) => isVisible(points, index, 0.25)).length;
    return {
      status: visibleFacePoints >= 2 ? "pass" : "warning",
      allowUpload: true,
      personCount: 1,
      confidence: people[0].conf,
      messageKo: visibleFacePoints >= 2 ? "한 사람과 얼굴 영역이 확인됐어요." : "한 사람은 확인했지만 얼굴 각도는 직접 확인해 주세요.",
      messageZh: visibleFacePoints >= 2 ? "YOLO 已确认单人及面部区域。" : "YOLO 已确认单人，请继续人工确认面部角度。",
    };
  }

  return {
    status: "warning",
    allowUpload: true,
    personCount: 0,
    messageKo: "얼굴 근접 사진은 YOLO가 인물을 놓칠 수 있어요. 얼굴이 선명한지 직접 확인해 주세요.",
    messageZh: "近距离面部照片可能无法被 YOLO 完整识别，请人工确认面部清晰、无遮挡。",
  };
}

