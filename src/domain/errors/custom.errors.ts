export class CustomError extends Error {
  public statusCode: number;

  constructor(message: string, statusCode: number) {
    super(message);
    this.statusCode = statusCode;
    Object.setPrototypeOf(this, new.target.prototype); // Restablece el prototipo explícitamente
  }

  static notFound(message: string): CustomError {
    return new CustomError(message, 404);
  }

  static badRequest(message: string): CustomError {
    return new CustomError(message, 400);
  }

  static internal(message: string): CustomError {
    return new CustomError(message, 500);
  }

  static unauthorized(message: string): CustomError {
    return new CustomError(message, 401);
  }
  static forbidden(message: string): CustomError {
    return new CustomError(message, 403);
  }
}
