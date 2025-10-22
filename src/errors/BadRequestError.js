import { BaseError } from "./BaseError.js";

export class BadRequestError extends BaseError {
  constructor(message = "Bad request") {
    super(message, 400);
  }
}
