const response = (statusCode, data, message, res) => {
  res.json({
    status: statusCode,
    message: message,
    data: data,
    pagination: {
      prev: {
        id: "",
      },
      next: {
        id: "",
      },
    },
  });
};

module.exports = response;
