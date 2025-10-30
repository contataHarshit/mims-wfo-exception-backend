import { header, validationResult } from "express-validator";

export const validateSessionRequest = [
  header("sessionid")
    .exists()
    .withMessage("Missing sessionID in headers")
    .isString()
    .bail()
    .withMessage("SessionID must be a string")
    .notEmpty()
    .bail()
    .withMessage("SessionID cannot be empty"),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        success: false,
        errors: errors.array().map((e) => ({
          field: e.path,
          message: e.msg,
        })),
      });
    }
    next();
  },
];
