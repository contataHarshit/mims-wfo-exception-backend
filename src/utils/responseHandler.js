// utils/responseHandler.js

export const sendSuccess = (res, data = {}, statusCode = 200) => {
  return res.status(statusCode).json({
    success: true,
    data: data,
  });
};

export const sendError = (res, error, defaultStatusCode = 500) => {
  const statusCode = error.statusCode || defaultStatusCode;
  return res.status(statusCode).json({
    success: false,
    error: error.message || "Internal Server Error",
  });
};
