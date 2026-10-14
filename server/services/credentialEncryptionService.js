import crypto from "node:crypto";

const ALGORITHM = "aes-256-gcm";


const getEncryptionKey = () => {
  const key =
    process.env.AGENT_CREDENTIALS_KEY;

  if (!key) {
    throw new Error(
      "AGENT_CREDENTIALS_KEY is not configured"
    );
  }

  const buffer =
    Buffer.from(key, "hex");

  if (buffer.length !== 32) {
    throw new Error(
      "AGENT_CREDENTIALS_KEY must be a 32-byte hex key"
    );
  }

  return buffer;
};


export const encryptCredential = (value) => {
  if (!value) {
    return null;
  }

  const key =
    getEncryptionKey();

  const iv =
    crypto.randomBytes(12);

  const cipher =
    crypto.createCipheriv(
      ALGORITHM,
      key,
      iv
    );

  const encrypted =
    Buffer.concat([
      cipher.update(
        value,
        "utf8"
      ),
      cipher.final(),
    ]);

  const authTag =
    cipher.getAuthTag();

  return {
    encryptedValue:
      encrypted.toString("hex"),

    iv:
      iv.toString("hex"),

    authTag:
      authTag.toString("hex"),
  };
};


export const decryptCredential = (
  credential
) => {
  if (
    !credential?.encryptedValue ||
    !credential?.iv ||
    !credential?.authTag
  ) {
    return null;
  }

  const key =
    getEncryptionKey();

  const decipher =
    crypto.createDecipheriv(
      ALGORITHM,
      key,
      Buffer.from(
        credential.iv,
        "hex"
      )
    );

  decipher.setAuthTag(
    Buffer.from(
      credential.authTag,
      "hex"
    )
  );

  const decrypted =
    Buffer.concat([
      decipher.update(
        Buffer.from(
          credential.encryptedValue,
          "hex"
        )
      ),
      decipher.final(),
    ]);

  return decrypted.toString("utf8");
};