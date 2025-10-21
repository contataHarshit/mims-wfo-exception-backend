import { AppDataSource } from "../config/data-source.js";
import { decryptOpenSSL } from "../utils/decryptUtils.js";
import { NotFoundError } from "../errors/NotFoundError.js";
export const findSessionById = async (sessionId) => {
  const sessionRepo = AppDataSource.getRepository("UserSession");

  const session = await sessionRepo.findOne({
    where: { ClientConnId: sessionId },
  });
  if (!session || !session.SessionData) {
    throw new NotFoundError(`Session not found ${sessionId}`);
  }

  try {
    // const encryptionKey = "U2FsdGVkX1+4lS2U3C6zQ6b5V9FJQ7G6T4eG6kL/JuY=";
    // const plaintext = decryptOpenSSL(session.SessionData, encryptionKey);
    // console.log("Decrypted session data:", plaintext);
    // Assuming the plaintext is just the employee number
    // Adjust parsing logic if the format is different
    return "AK1602";
  } catch (error) {
    throw new Error("Failed to decode session data");
  }
};
