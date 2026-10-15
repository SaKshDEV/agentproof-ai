const HEADER_NAME_PATTERN =
  /^[!#$%&'*+\-.^_`|~0-9A-Za-z]+$/;

const FORBIDDEN_HEADERS = new Set([
  "host",
  "content-length",
  "content-type",
  "connection",
  "transfer-encoding",
  "upgrade",
  "proxy-connection",
  "keep-alive",
  "te",
  "trailer",
]);

export const validateAuthHeaderName = (
  headerName
) => {
  if (
    typeof headerName !== "string" ||
    !headerName.trim()
  ) {
    throw new Error(
      "API key header name is required"
    );
  }

  const normalizedHeader =
    headerName.trim();

  if (
    !HEADER_NAME_PATTERN.test(
      normalizedHeader
    )
  ) {
    throw new Error(
      "Invalid API key header name"
    );
  }

  if (
    FORBIDDEN_HEADERS.has(
      normalizedHeader.toLowerCase()
    )
  ) {
    throw new Error(
      "This API key header is not allowed"
    );
  }

  return normalizedHeader;
};