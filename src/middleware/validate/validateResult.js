import { validationResult } from "express-validator";

export const checkValidation = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    // Extract only the message from each error
    const messages = errors.array().map((err) => err.msg);

    return res.status(400).json({
      success: false,
      errors: messages[0], // Only messages
    });
  }
  next();
};
