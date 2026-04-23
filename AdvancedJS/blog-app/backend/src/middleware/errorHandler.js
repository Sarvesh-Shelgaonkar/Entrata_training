function errorHandler(err, req, res, next) {
  const status = err.status || err.statusCode || 500;
  const message =
    status === 500 ? "Internal server error" : err.message || "Something went wrong";

  if (status === 500) {
    console.error(err);
  }

  res.status(status).json({ message });
}

module.exports = { errorHandler };
