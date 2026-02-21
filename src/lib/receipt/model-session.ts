import * as ort from "onnxruntime-web";

let sessionPromise: Promise<ort.InferenceSession> | null = null;

async function initSession(): Promise<ort.InferenceSession> {
  const wasmPath = process.env.NEXT_PUBLIC_RECEIPT_WASM;
  const modelUrl = process.env.NEXT_PUBLIC_RECEIPT_MODEL;

  if (!wasmPath) {
    throw new Error("Missing NEXT_PUBLIC_RECEIPT_WASM");
  }

  if (!modelUrl) {
    throw new Error("Missing NEXT_PUBLIC_RECEIPT_MODEL");
  }

  ort.env.wasm.wasmPaths = wasmPath;

  return ort.InferenceSession.create(modelUrl, {
    executionProviders: ["wasm"],
    graphOptimizationLevel: "all",
  });
}

export function getReceiptSession(): Promise<ort.InferenceSession> {
  if (!sessionPromise) {
    sessionPromise = initSession().catch((error) => {
      sessionPromise = null;
      throw error;
    });
  }

  return sessionPromise;
}