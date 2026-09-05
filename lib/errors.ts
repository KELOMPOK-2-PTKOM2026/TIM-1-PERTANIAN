// Error terstandar (stub).
// TODO Fase 2: AppError + toHttpStatus untuk route handler / Server Action.
export class AppError extends Error {
  constructor(
    message: string,
    public readonly code: string = "INTERNAL",
  ) {
    super(message);
    this.name = "AppError";
  }
}
