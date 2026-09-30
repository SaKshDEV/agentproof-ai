const normalizeText = (value) => {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};


const extractTextFromOutput = (output) => {
  if (typeof output === "string") {
    return output;
  }

  if (
    output &&
    typeof output === "object"
  ) {
    const possibleKeys = [
      "response",
      "answer",
      "output",
      "message",
      "text",
      "content",
    ];

    for (const key of possibleKeys) {
      if (
        typeof output[key] === "string"
      ) {
        return output[key];
      }
    }

    return JSON.stringify(output);
  }

  return "";
};


export const evaluateNormalizedExact = (
  expectedOutput,
  actualOutput
) => {
  if (!expectedOutput?.trim()) {
    return {
      method: "none",
      score: null,
      passed: null,
      reason:
        "No expected output was provided.",
    };
  }

  const actualText =
    extractTextFromOutput(actualOutput);

  if (!actualText.trim()) {
    return {
      method: "normalized_exact",
      score: 0,
      passed: false,
      reason:
        "Agent returned no text response.",
    };
  }

  const normalizedExpected =
    normalizeText(expectedOutput);

  const normalizedActual =
    normalizeText(actualText);

  const passed =
    normalizedExpected ===
    normalizedActual;

  return {
    method: "normalized_exact",

    score: passed ? 100 : 0,

    passed,

    reason: passed
      ? "Agent response matched the expected output after normalization."
      : "Agent response did not match the expected output after normalization.",
  };
};