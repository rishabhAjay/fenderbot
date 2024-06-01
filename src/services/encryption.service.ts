import crypto from "crypto";
import { env } from "../env";

const IV_LENGTH = 16; // For AES, this is always 16
const algorithm = "aes-256-cbc";
const encryptKey = (text: string) => {
  const iv = crypto.randomBytes(IV_LENGTH);
  const cipher = crypto.createCipheriv(
    algorithm,
    Buffer.from(env.ENCRYPTION_KEY),
    iv
  );
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString("hex") + ":" + encrypted.toString("hex");
};

const decryptKey = (text: string) => {
  const textParts = text.split(":");

  const iv = Buffer.from(textParts.shift() as string, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    algorithm,
    Buffer.from(env.ENCRYPTION_KEY),
    iv
  );
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};

export { decryptKey, encryptKey };
