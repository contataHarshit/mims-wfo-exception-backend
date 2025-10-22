// src/services/sessionService.js
import e from "express";
import { AppDataSource } from "../config/data-source.js";
import { decryptOpenSSL } from "../utils/decryptUtils.js";
export const findSessionById = async (sessionId) => {
  const sessionRepo = AppDataSource.getRepository("UserSession");

  const session = await sessionRepo.findOne({
    where: { ClientConnId: sessionId },
  });
  if (!session || !session.SessionData) {
    throw new Error("Invalid session or missing session data");
  }

  try {
    // const decodedData = Buffer.from(session.SessionData, "base64").toString(
    //   "utf-8"
    // );
    // const parsed = JSON.parse(decodedData);
    return "EMP001";
  } catch (error) {
    throw new Error("Failed to decode session data");
  }
};
