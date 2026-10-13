import net from "node:net";

const isPrivateIPv4 = (ip) => {
  const parts = ip.split(".").map(Number);

  if (parts.length !== 4) {
    return false;
  }

  const [a, b] = parts;

  return (
    a === 10 ||
    a === 127 ||
    (a === 169 && b === 254) ||
    (a === 172 && b >= 16 && b <= 31) ||
    (a === 192 && b === 168)
  );
};

export const validateAgentUrl = (endpointUrl) => {
  let url;

  try {
    url = new URL(endpointUrl);
  } catch {
    throw new Error("Invalid agent endpoint URL");
  }

  if (
    url.protocol !== "http:" &&
    url.protocol !== "https:"
  ) {
    throw new Error(
      "Only HTTP and HTTPS agent endpoints are allowed"
    );
  }

  const hostname = url.hostname.toLowerCase();

  const isDevelopment =
    process.env.NODE_ENV !== "production";

  if (
    isDevelopment &&
    (
      hostname === "localhost" ||
      hostname === "127.0.0.1"
    )
  ) {
    return url;
  }

  if (
    hostname === "localhost" ||
    hostname === "::1"
  ) {
    throw new Error(
      "Localhost endpoints are not allowed in production"
    );
  }

  if (
    net.isIP(hostname) === 4 &&
    isPrivateIPv4(hostname)
  ) {
    throw new Error(
      "Private network endpoints are not allowed"
    );
  }

  if (
    net.isIP(hostname) === 6 &&
    (
      hostname === "::1" ||
      hostname.startsWith("fc") ||
      hostname.startsWith("fd") ||
      hostname.startsWith("fe80:")
    )
  ) {
    throw new Error(
      "Private network endpoints are not allowed"
    );
  }

  return url;
};