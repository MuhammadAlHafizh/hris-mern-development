export default function errorHandler(err, req, res, next) {
  console.error(err);
  console.log('kontol')
  const status = err.status || 500;
  res.status(status).json({
    message: err.message || "Internal Server Error",
    stack: process.env.NODE_ENV === "production" ? undefined : err.stack
  });
}
