class CustomError extends Error {
  constructor(message, status) {
    super(message);
    this.message = message;
    this.status = status;
  }
}

const createError = (message, status) => {
  if (!status) status = 400;
  throw new CustomError(message, status);
};

const routeNotFound = (req, res) =>
  res.status(404).json({ message: "Route not found" });

const asyncErrorWrapper = (fn) => (req, res, next) =>
  fn(req, res, next).catch(next);

const errorHandler = (err, req, res, next) => {
  if (err instanceof CustomError) {
    res.status(err.status).json({ message: err.message });
  } else {
    if (err.code === 11000) {
      const key = Object.keys(err.keyValue)[0];
      res.status(400).json({ message: `${key} already exists` });
    } else {
      res.status(500).json({ message: err.message || "Internal server error" });
    }
  }
};

module.exports = {
  createError,
  routeNotFound,
  asyncErrorWrapper,
  errorHandler,
};
