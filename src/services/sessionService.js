import { AppDataSource } from "../config/data-source.js";
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
    return session.SessionData;
  } catch (error) {
    throw new Error("Failed to decode session data");
  }
};
