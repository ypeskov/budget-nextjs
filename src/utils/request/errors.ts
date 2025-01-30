export class UnauthorizedError extends Error {
  constructor(message = 'Unauthorized') {
    super(message);
    this.name = 'UnauthorizedError';
  }
}

export class ValidationError extends Error {
  detail: object;
  
  constructor(message = 'Validation error', detail: object) {
    super(message); 
    this.name = 'ValidationError';
    this.detail = detail;
  }
}
