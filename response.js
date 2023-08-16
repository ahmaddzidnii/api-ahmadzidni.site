const response = (statusCode, data, message, res, paginationInfo) => {
  res.status(statusCode).json({
    status: statusCode,
    message: message,
    datas: data,
    paginationInfo,
  });
};

module.exports = response;
