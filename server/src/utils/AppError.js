// An error we expect (wrong password, phone already used...) with the HTTP status to send back
export class AppError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}
