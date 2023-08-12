const NotFound = (statusCode, message, res) => {
    res.status(statusCode).json({
        status: statusCode,
        message: message,
    });
};

module.exports = NotFound