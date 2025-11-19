// sendMail.js

import nodemailer from "nodemailer";
import logger from "./logger.js";
import { renderTemplate } from "./renderTemplate.mjs";
import dotenv from "dotenv";

dotenv.config();

export const sendMail = async (to, templateKey, templateData, cc) => {
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
      subject,
      html: body,
      cc: cc ? (Array.isArray(cc) ? cc : [cc]) : undefined,
    };
    // if (cc) {
    //   mailOptions.cc = [cc];
    //   if (templateKey === "APPROVED") {
    //     mailOptions.cc.push(process.env.ADMIN_EMAIL);
    //   }
    // }
    console.log("Mail options:", mailOptions); // Debug log
    const info = await transporter.sendMail(mailOptions);
    logger.info(`Mail sent, messageId: ${info.messageId} to: ${to}`);
    return true;
  } catch (error) {
    logger.error("Error sending email:", error);
    // You can inspect error.code, error.response, etc.
    return false;
  }
};
