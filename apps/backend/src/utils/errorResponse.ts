class ErrorResponse extends Error {
    statusCode: number;
    constructor(message: string, statusCode: number) {
        super(message);
        this.statusCode = statusCode;

        // Keep the stack trace
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export default ErrorResponse;
