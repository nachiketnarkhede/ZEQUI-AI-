const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["text/plain", "application/pdf", "image/jpeg", "image/png"];
const ALLOWED_EXTENSIONS = [".txt", ".pdf", ".jpg", ".jpeg", ".png"];

export interface FileValidationResult {
  valid: boolean;
  error?: string;
}

export interface ProcessedFile {
  type: "text" | "image";
  content: string;
  name: string;
}

export function validateFile(file: File): FileValidationResult {
  const ext = "." + file.name.split(".").pop()?.toLowerCase();

  if (!ALLOWED_EXTENSIONS.includes(ext) && !ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `Invalid file type. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File too large. Maximum size is 5MB. Your file is ${(file.size / 1024 / 1024).toFixed(2)}MB.`,
    };
  }

  return { valid: true };
}

export function sanitizeText(text: string): string {
  // These values are rendered as React text nodes, so React performs HTML escaping.
  // Returning the original text also prevents entities such as & from appearing as &amp;.
  return text;
}

export async function processFile(file: File): Promise<ProcessedFile> {
  const ext = file.name.split(".").pop()?.toLowerCase();

  if (ext === "txt") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = typeof reader.result === "string" ? reader.result : "";
        resolve({ type: "text", content: text, name: file.name });
      };
      reader.onerror = () => reject(new Error("Failed to read file"));
      reader.readAsText(file);
    });
  }

  if (ext === "pdf") {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = async () => {
        try {
          const arrayBuffer = reader.result as ArrayBuffer;
          const text = await extractPdfText(arrayBuffer);
          resolve({ type: "text", content: text, name: file.name });
        } catch (err) {
          reject(new Error("Failed to extract PDF text"));
        }
      };
      reader.onerror = () => reject(new Error("Failed to read PDF"));
      reader.readAsArrayBuffer(file);
    });
  }

  if (["jpg", "jpeg", "png"].includes(ext || "")) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        resolve({ type: "image", content: base64, name: file.name });
      };
      reader.onerror = () => reject(new Error("Failed to read image"));
      reader.readAsDataURL(file);
    });
  }

  throw new Error("Unsupported file type");
}

async function extractPdfText(arrayBuffer: ArrayBuffer): Promise<string> {
  try {
    const uint8Array = new Uint8Array(arrayBuffer);
    let text = "";
    let inTextBlock = false;
    let currentText = "";

    for (let i = 0; i < uint8Array.length; i++) {
      const char = String.fromCharCode(uint8Array[i]);

      if (char === "(" && !inTextBlock) {
        inTextBlock = true;
        currentText = "";
        continue;
      }

      if (char === ")" && inTextBlock) {
        inTextBlock = false;
        if (currentText.trim()) {
          text += currentText + " ";
        }
        currentText = "";
        continue;
      }

      if (inTextBlock && uint8Array[i] >= 32 && uint8Array[i] <= 126) {
        currentText += char;
      }
    }

    text = text
      .replace(/\\n/g, "\n")
      .replace(/\\r/g, "\r")
      .replace(/\\t/g, "\t")
      .replace(/\s+/g, " ")
      .trim();

    return text || "Could not extract text from PDF. Please paste the content manually.";
  } catch {
    return "Could not extract text from PDF. Please paste the content manually.";
  }
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(2) + " MB";
}
