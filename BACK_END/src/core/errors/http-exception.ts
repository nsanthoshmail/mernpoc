// src/core/errors/http-exception.ts
export class HttpException extends Error {
    public status: number;
    public override message: string; // Override Error's message property
  
    constructor(status: number, message: string) {
      super(message); // Call parent constructor
      this.status = status;
      this.message = message;
      // Set the prototype explicitly for correct instanceof checks
      Object.setPrototypeOf(this, HttpException.prototype);
    }
  }
  
  // Example specific error
  export class NotFoundException extends HttpException {
    constructor(message: string = 'Not Found') {
      super(404, message);
      Object.setPrototypeOf(this, NotFoundException.prototype);
    }
  }
  
  export class UnauthorizedException extends HttpException {
      constructor(message: string = 'Unauthorized') {
        super(401, message);
        Object.setPrototypeOf(this, UnauthorizedException.prototype);
      }
    }
