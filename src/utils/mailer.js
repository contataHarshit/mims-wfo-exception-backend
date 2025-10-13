// sendMail.js

import nodemailer from "nodemailer";
import logger from "./logger.js";

export const sendMail = async (toEmailId, subject, body) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: "contata.in",
    port: 25,
    secure: false,
    logger: true,
    debug: true,
    // If SMTP auth is required, include:
    // auth: {
    //   user: process.env.SMTP_USER,
    //   pass: process.env.SMTP_PASS
    // }
  });

  try {
    // Verify transporter (checks DNS, connection, authentication)
    await transporter.verify();
    logger.info("SMTP server is ready to accept messages");

    const mailOptions = {
      from: "harshits@contata.in",
      to: "dharmendrak@contata.in",
      subject: subject,
      text: body,
    };

    const info = await transporter.sendMail(mailOptions);
    logger.info("Mail sent, messageId:", info.messageId);
    return true;
  } catch (error) {
    logger.error("Error sending email:", error);
    // You can inspect error.code, error.response, etc.
    return false;
  }
};
