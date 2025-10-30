import { body, query } from "express-validator";

export const validateCreateExceptionRequest = [
  //  Ensure `exceptions` is a non-empty array
  body("exceptions")
    .isArray({ min: 1 })
    .withMessage("exceptions must be a non-empty array"),

  //  Validate each object inside `exceptions`
  body("exceptions.*.selectedDate")
    .notEmpty()
    .withMessage("selectedDate is required")
    .custom((value) => {
      if (isNaN(Date.parse(value))) {
        throw new Error(`Invalid date format: ${value}`);
      }
      return true;
    }),

  body("exceptions.*.primaryReason")
    .notEmpty()
    .withMessage("primaryReason is required")
    .isString()
    .withMessage("primaryReason must be a string"),

  body("exceptions.*.remarks")
    .notEmpty()
    .withMessage("remarks is required")
    .isString()
    .withMessage("remarks must be a string"),
];
export const validateBulkUpdateExceptionRequest = [
  body("ids").custom((ids) => {
    if (!Array.isArray(ids)) {
      throw new Error("ids must be an array");
    }
    if (ids.length === 0) {
      throw new Error("ids must be a non-empty array");
    }
    for (const id of ids) {
      if (!Number.isInteger(id)) {
        throw new Error(`Each id must be an integer. Invalid id: ${id}`);
      }
    }
    return true;
  }),

  body("status")
    .notEmpty()
    .withMessage("status is required")
    .isIn(["APPROVED", "REJECTED"])
    .withMessage("status must be either 'APPROVED' or 'REJECTED'"),
];

export const validateGetSelectionDates = [
  query("month")
    .notEmpty()
    .withMessage("month is required")
    .isInt({ min: 1, max: 12 })
    .withMessage("month must be an integer between 1 and 12"),

  query("year")
    .notEmpty()
    .withMessage("year is required")
    .isInt({ min: 1900 })
    .withMessage("year must be a valid integer"),
];
export const validateGetExceptionRequests = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page must be a positive integer"),
  query("limit")
    .optional()
    .isInt({ min: 1 })
    .withMessage("limit must be a positive integer"),
  query("fromDate")
    .optional()
    .isISO8601()
    .withMessage("fromDate must be a valid ISO date"),
  query("toDate")
    .optional()
    .isISO8601()
    .withMessage("toDate must be a valid ISO date"),
  query("employeeName")
    .optional()
    .isString()
    .withMessage("employeeName must be a string"),
  query("managerName")
    .optional()
    .isString()
    .withMessage("managerName must be a string"),
  query("status")
    .optional()
    .isIn(["PENDING", "APPROVED", "REJECTED"])
    .withMessage("Invalid status"),
  query("reason").optional().isString().withMessage("reason must be a string"),
  query("exportAll")
    .optional()
    .isBoolean()
    .withMessage("exportAll must be true or false"),
];

export const validateSummaryRequest = [
  query("fromDate")
    .optional()
    .isISO8601()
    .withMessage("fromDate must be a valid ISO date"),
  query("toDate")
    .optional()
    .isISO8601()
    .withMessage("toDate must be a valid ISO date"),
  query("employeeName")
    .optional()
    .isString()
    .withMessage("employeeName must be a string"),
  query("managerName")
    .optional()
    .isString()
    .withMessage("managerName must be a string"),
  query("status")
    .optional()
    .isIn(["PENDING", "APPROVED", "REJECTED"])
    .withMessage("Invalid status"),
  query("reason").optional().isString().withMessage("reason must be a string"),
];
