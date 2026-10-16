import net from "node:net";
import {
  lookup,
} from "node:dns/promises";

const isUnsafeIPv4 = (ip) => {
  const parts = ip
    .split(".")
    .map(Number);

  if (
    parts.length !== 4 ||
    parts.some(
      (part) =>
        !Number.isInteger(part) ||
        part < 0 ||
        part > 255
    )
  ) {
    return true;
  }

  const [a, b] = parts;

  return (
    a === 0 ||
    a === 10 ||
    a === 127 ||
    (
      a === 100 &&
      b >= 64 &&
      b <= 127
    ) ||
    (
      a === 169 &&
      b === 254
    ) ||
    (
      a === 172 &&
      b >= 16 &&
      b <= 31
    ) ||
    (
      a === 192 &&
      b === 168
    ) ||
    (
      a === 198 &&
      (b === 18 || b === 19)
    ) ||
    a >= 224
  );
};

const isUnsafeIPv6 = (ip) => {
  const normalized =
    ip.toLowerCase();

  if (
    normalized === "::" ||
    normalized === "::1"
  ) {
    return true;
  }

  if (
    normalized.startsWith(
      "::ffff:"
    )
  ) {
    return true;
  }

  if (
    normalized.startsWith("fc") ||
    normalized.startsWith("fd")
  ) {
    return true;
  }

  const firstBlock = parseInt(
    normalized.split(":")[0] || "0",
    16
  );

  if (
    (firstBlock & 0xffc0) ===
    0xfe80
  ) {
    return true;
  }

  // IPv6 multicast ff00::/8
  if (
    normalized.startsWith("ff")
  ) {
    return true;
  }

  return false;
};
const validateIpAddress = (ip) => {
  const version = net.isIP(ip);

  if (
    version === 4 &&
    isUnsafeIPv4(ip)
  ) {
    throw new Error(
      "Private or non-public network endpoints are not allowed"
    );
  }

  if (
    version === 6 &&
    isUnsafeIPv6(ip)
  ) {
    throw new Error(
      "Private or non-public network endpoints are not allowed"
    );
  }

  if (version === 0) {
    throw new Error(
      "Agent endpoint resolved to an invalid IP address"
    );
  }
};


const validateResolvedHostname =
  async (hostname) => {
    if (net.isIP(hostname)) {
      validateIpAddress(hostname);
      return;
    }

    let addresses;

    try {
      addresses = await lookup(
        hostname,
        {
          all: true,
          verbatim: true,
        }
      );
    } catch {
      throw new Error(
        "Agent endpoint hostname could not be resolved"
      );
    }

    if (!addresses.length) {
      throw new Error(
        "Agent endpoint hostname could not be resolved"
      );
    }

    for (const entry of addresses) {
      validateIpAddress(
        entry.address
      );
    }
  };

export const validateAgentUrl = async (endpointUrl) => {
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
  if (
    url.username ||
    url.password
  ) {
    throw new Error(
      "Credentials inside agent endpoint URLs are not allowed"
    );
  }

  const hostname = url.hostname
    .replace(/^\[/, "")
    .replace(/\]$/, "")
    .replace(/\.$/, "")
    .toLowerCase();

  const isDevelopment =
    process.env.NODE_ENV !== "production";

  const isLocalDevelopmentHost =
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "127.0.0.1" ||
    hostname === "::1";

  if (
    isDevelopment &&
    isLocalDevelopmentHost
  ) {
    return url;
  }

  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname === "127.0.0.1" ||
    hostname === "::1"
  ) {
    throw new Error(
      "Localhost endpoints are not allowed in production"
    );
  }

  await validateResolvedHostname(
    hostname
  );

  return url;
}