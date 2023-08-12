const response = (statusCode, data, message, res, paginationInfo) => {
  res.json({
    status: statusCode,
    message: message,
    datas: data,
    paginationInfo,
  });
};

module.exports = response;
