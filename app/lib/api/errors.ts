export class APIError extends Error {
  constructor(public status: number, message: string, public data?: unknown) {
    super(message);
    this.name = "APIError";
  }
}
