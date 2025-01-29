class CustomError extends Error {
  constructor(statusCode, msg) {
    super(msg);
    this.statusCode = statusCode;
  }
}

const createCustomError = (statusCode, msg) => {
  return new CustomError(statusCode, msg);
};
module.exports = { createCustomError, CustomError };
