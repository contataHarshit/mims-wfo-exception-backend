import { BaseError } from "./BaseError.js";

export class AuthError extends BaseError {
  constructor(message = "Authentication failed", statusCode = 401) {
    super(message, statusCode);
  }
}

export class AuthorizationError extends BaseError {
  constructor(message = "Authorization failed", statusCode = 403) {
    super(message, statusCode);
  }
}

export class PermissionDeniedError extends BaseError {
  constructor(message = "Permission denied", statusCode = 403) {
    super(message, statusCode);
  }
}
