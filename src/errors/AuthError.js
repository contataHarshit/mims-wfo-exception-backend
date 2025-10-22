// src/errors/AuthError.js
import { BaseError } from "./BaseError.js";

export class AuthError extends BaseError {
  constructor(message = "Authentication failed", statusCode = 401) {
    super(message, statusCode);
  }
}
