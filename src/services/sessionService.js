import { AppDataSource } from "../config/data-source.js";
import { NotFoundError } from "../errors/NotFoundError.js";
import WFH_UserSessions from "../entity/legacy/WFH_UserSessions.js";
export const findSessionById = async (sessionId) => {
  const sessionRepo = AppDataSource.getRepository(WFH_UserSessions);

  const session = await sessionRepo
    .createQueryBuilder("s")
    .where("s.ClientConnId = :id", { id: sessionId })
    .getOne();
  if (!session || !session.SessionData) {
    throw new NotFoundError(`Session not found: ${sessionId}`);
  }

  try {
    const sessionStr = session.SessionData.trim();

    // ✅ Ensure JSON-compatible by adding double quotes to keys
    const validJsonStr = sessionStr.replace(/([{,]\s*)(\w+)\s*:/g, '$1"$2":');

    const sessionObj = JSON.parse(validJsonStr);

    return sessionObj.EncryptedEmployeeNumber; // ✅ return parsed object
  } catch (error) {
    console.error(error);
    throw new Error("Failed to decode session data");
  }
};
