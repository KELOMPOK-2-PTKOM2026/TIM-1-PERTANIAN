// Error terstandar.
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = "INTERNAL",
  ) {
    super(message);
    this.name = "AppError";
  }
}

// Mapping kode error -> status HTTP untuk route handler / Server Action.
export function toHttpStatus(code: string): number {
  switch (code) {
    case "VALIDATION":
      return 400;
    case "UNAUTHORIZED":
      return 401;
    case "FORBIDDEN":
      return 403;
    case "NOT_FOUND":
      return 404;
    case "EMAIL_TAKEN":
    case "SLUG_TAKEN":
      return 409;
    case "DB_UNAVAILABLE":
      return 503;
    default:
      return 500;
  }
}
