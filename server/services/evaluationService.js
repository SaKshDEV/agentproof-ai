const normalizeText = (value) => {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
};

const tokenizeText = (value) => {
  return normalizeText(value)
    .replace(/[^\w\s]/g, "")
    .split(" ")
    .filter(Boolean);
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
export const evaluateTokenSimilarity = (
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
      method: "token_similarity",
      score: 0,
      passed: false,
      reason:
        "Agent returned no text response.",
    };
  }

  const expectedTokens =
    new Set(tokenizeText(expectedOutput));

  const actualTokens =
    new Set(tokenizeText(actualText));

  const commonTokens = [
    ...expectedTokens,
  ].filter((token) =>
    actualTokens.has(token)
  );

  const allTokens = new Set([
    ...expectedTokens,
    ...actualTokens,
  ]);

  const score =
    allTokens.size > 0
      ? Math.round(
          (commonTokens.length /
            allTokens.size) *
            100
        )
      : 0;

  const passed = score >= 60;

  return {
    method: "token_similarity",
    score,
    passed,
    reason: passed
      ? "Agent response had sufficient word-level similarity with the expected output."
      : "Agent response did not have sufficient word-level similarity with the expected output.",
  };
};