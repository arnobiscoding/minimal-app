/**
 * Custom error classes and error handling utilities
 */

import { HTTP_STATUS, ERROR_MESSAGES } from "./constants";

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = HTTP_STATUS.INTERNAL_ERROR,
    public code?: string
  ) {
    super(message);
    this.name = this.constructor.name;
    Error.captureStackTrace(this, this.constructor);
  }
}

export class ValidationError extends AppError {
  constructor(message: string = ERROR_MESSAGES.VALIDATION_ERROR, details?: any) {
    super(message, HTTP_STATUS.BAD_REQUEST, "VALIDATION_ERROR");
    this.details = details;
  }
  details?: any;
}

export class UnauthorizedError extends AppError {
  constructor(message: string = ERROR_MESSAGES.UNAUTHORIZED) {
    super(message, HTTP_STATUS.UNAUTHORIZED, "UNAUTHORIZED");
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = ERROR_MESSAGES.FORBIDDEN) {
    super(message, HTTP_STATUS.FORBIDDEN, "FORBIDDEN");
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = ERROR_MESSAGES.NOT_FOUND) {
    super(message, HTTP_STATUS.NOT_FOUND, "NOT_FOUND");
  }
}

export class ConflictError extends AppError {
  constructor(message: string) {
    super(message, HTTP_STATUS.CONFLICT, "CONFLICT");
  }
}

/**
 * Standardized error response format
 */
export interface ErrorResponse {
  error: string;
  code?: string;
  details?: any;
  timestamp?: string;
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  error: Error | AppError,
  includeDetails = false
): ErrorResponse {
  const response: ErrorResponse = {
    error: error.message,
    timestamp: new Date().toISOString(),
  };

  if (error instanceof AppError) {
    response.code = error.code;
    if (includeDetails && "details" in error && error.details) {
      response.details = error.details;
    }
  }

  return response;
}

/**
 * Handles errors and returns appropriate response
 */
export function handleError(error: unknown): {
  statusCode: number;
  response: ErrorResponse;
} {
  if (error instanceof AppError) {
    return {
      statusCode: error.statusCode,
      response: createErrorResponse(error),
    };
  }

  if (error instanceof Error) {
    return {
      statusCode: HTTP_STATUS.INTERNAL_ERROR,
      response: createErrorResponse(error),
    };
  }

  return {
    statusCode: HTTP_STATUS.INTERNAL_ERROR,
    response: {
      error: ERROR_MESSAGES.INTERNAL_ERROR,
      timestamp: new Date().toISOString(),
    },
  };
}

