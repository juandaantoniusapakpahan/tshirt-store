class CustomError extends Error {
  constructor(message, statuCode = 400) {
    super(message);
    this.name = "CustomError";
    this.statusCode = statuCode;
  }
}
module.exports = CustomError;
