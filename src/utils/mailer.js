// sendMail.js

import nodemailer from "nodemailer";
import logger from "./logger.js";
import { renderTemplate } from "./renderTemplate.mjs";
import dotenv from "dotenv";

dotenv.config();

export const sendMail = async (to, cc, templateKey, templateData) => {
  // Create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMPTP_PORT ? parseInt(process.env.SMPTP_PORT) : 25,
    secure: false,
    logger: false,
    debug: true,
    tls: {
      rejectUnauthorized: false, // <-- allow self-signed certs
    },
  });
  try {
    const { subject, body } = renderTemplate(templateKey, templateData);
    // Verify transporter (checks DNS, connection, authentication)
    await transporter.verify();
    // logger.info("SMTP server is ready to accept messages");

    const mailOptions = {
      from: process.env.SMTP_EMAIL_SENDER,
      to,
      cc: [cc, process.env.HR_EMAIL],
      subject,
      html: body,
    };
    console.log(mailOptions);
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Mail sent, messageId: ${info.messageId} to: ${to}`);
    return true;
  } catch (error) {
    logger.error("Error sending email:", error);
    // You can inspect error.code, error.response, etc.
    return false;
  }
};
