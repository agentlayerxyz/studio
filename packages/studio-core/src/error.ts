export const ErrorCode = {
  BAD_PARAMS: "BAD_PARAMS",
  NOT_FOUND: "NOT_FOUND",
  INVALID_STATE: "INVALID_STATE",
  INVALID_TRADING_STATE: "INVALID_TRADING_STATE",
  INTERNAL_ERROR: "INTERNAL_ERROR",
  UNAUTHORIZED: "UNAUTHORIZED",
  UNKNOWN: "UNKNOWN",
} as const;

export type ErrorCode = (typeof ErrorCode)[keyof typeof ErrorCode];

export class CommonError extends Error {
  code: ErrorCode;
  description?: string;

  constructor(code: ErrorCode, message?: string, cause?: unknown) {
    if (code === ErrorCode.UNKNOWN) {
      super(message ?? "");
    } else {
      super(`${code}${message ? `::${message}` : ""}`);
    }
    this.code = code;
    this.description = message;

    if (cause) {
      this.cause = cause;
      this.stack = cause instanceof Error ? cause.stack : undefined;
    }
  }

  static fromMessage(message: string) {
    const parsed = parseErrorMessage(message);
    return new CommonError(parsed.code, parsed.message);
  }

  static fromError(error: Error) {
    return toCommonError(error);
  }
}

export function parseError(error: Error) {
  return parseErrorMessage(error.message);
}

export function toCommonError(error: Error) {
  const parsed = parseError(error);
  return new CommonError(parsed.code, parsed.message);
}

export function parseErrorMessage(message: string) {
  const match = /^(\w+)(?:::(.*))?$/.exec(message);
  if (match) {
    if (match[1] && match[1] in ErrorCode) {
      return { code: match[1] as keyof typeof ErrorCode, message: match[2] };
    } else if (match[2]) {
      return { code: ErrorCode.UNKNOWN, message: match[2] };
    }
  }

  return { code: ErrorCode.UNKNOWN, message };
}

export function getUserFriendlyMessage(error: CommonError) {
  switch (error.code) {
    case ErrorCode.INVALID_STATE:
    case ErrorCode.BAD_PARAMS:
    case ErrorCode.NOT_FOUND:
      return "Some inputs doesn't make sense";
    case ErrorCode.INVALID_TRADING_STATE:
      return "We cannot fulfill your request at this time";
    case ErrorCode.UNKNOWN:
    case ErrorCode.INTERNAL_ERROR:
      return "Something went wrong";
  }
}
