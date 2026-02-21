import * as ort from "onnxruntime-web";
import { getReceiptSession } from "./model-session";

const RECEIPT_LABELS = ["non-receipt", "receipt"] as const;

const _softmax = (logits: Float32Array): Float32Array => {
  const max = Math.max(...logits);
  const expValues = Array.from(logits).map((x) => Math.exp(x - max));
  const sum = expValues.reduce((a, b) => a + b, 0);
  return new Float32Array(expValues.map((x) => x / sum));
};

const processImage = async (
  imageSrc: string,
  session: ort.InferenceSession,
  labels: readonly string[]
): Promise<{
  label: string;
  confidence: number;
}> => {
  const img = new window.Image();
  img.src = imageSrc;

  await new Promise<void>((resolve, reject) => {
    img.onload = () => resolve();
    img.onerror = () => reject(new Error("이미지를 불러오지 못했습니다."));
  });

  const canvas = document.createElement("canvas");
  canvas.width = 224;
  canvas.height = 224;

  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("이미지 처리 중 오류가 발생했습니다.");

  ctx.drawImage(img, 0, 0, 224, 224);
  const imageData = ctx.getImageData(0, 0, 224, 224).data;

  const float32Data = new Float32Array(3 * 224 * 224);
  for (let i = 0; i < 224 * 224; i++) {
    float32Data[i] = (imageData[i * 4] / 255.0 - 0.485) / 0.229;
    float32Data[i + 50176] = (imageData[i * 4 + 1] / 255.0 - 0.456) / 0.224;
    float32Data[i + 100352] = (imageData[i * 4 + 2] / 255.0 - 0.406) / 0.225;
  }

  const inputTensor = new ort.Tensor("float32", float32Data, [1, 3, 224, 224]);
  const outputData = await session.run({ [session.inputNames[0]]: inputTensor });
  const output = outputData[session.outputNames[0]].data as Float32Array;

  const probs = _softmax(output);
  const maxIdx = probs.indexOf(Math.max(...probs));

  return {
    label: labels[maxIdx] ?? `Unknown (${maxIdx})`,
    confidence: probs[maxIdx] ?? 0,
  };
};

export async function classifyReceiptImage(file: File): Promise<{
  confidence: number;
  isReceipt: boolean;
}> {
  const imageSrc = URL.createObjectURL(file);

  try {
    const session = await getReceiptSession();
    const result = await processImage(imageSrc, session, RECEIPT_LABELS);

    return {
      confidence: result.confidence,
      isReceipt: result.label === "receipt",
    };
  } finally {
    URL.revokeObjectURL(imageSrc);
  }
}
