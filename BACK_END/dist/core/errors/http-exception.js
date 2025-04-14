"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UnauthorizedException = exports.NotFoundException = exports.HttpException = void 0;
// src/core/errors/http-exception.ts
class HttpException extends Error {
    constructor(status, message) {
        super(message); // Call parent constructor
        this.status = status;
        this.message = message;
        // Set the prototype explicitly for correct instanceof checks
        Object.setPrototypeOf(this, HttpException.prototype);
    }
}
exports.HttpException = HttpException;
// Example specific error
class NotFoundException extends HttpException {
    constructor(message = 'Not Found') {
        super(404, message);
        Object.setPrototypeOf(this, NotFoundException.prototype);
    }
}
exports.NotFoundException = NotFoundException;
class UnauthorizedException extends HttpException {
    constructor(message = 'Unauthorized') {
        super(401, message);
        Object.setPrototypeOf(this, UnauthorizedException.prototype);
    }
}
exports.UnauthorizedException = UnauthorizedException;
