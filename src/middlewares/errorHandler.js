const errorHandler = (err, req, res, next) => {
    if (err.code === 11000) {
        return res.status(409).json({ success: false, message: "A record with this value already exists" });
    }
    if (err.name === "ValidationError" || err.name === "CastError") {
        return res.status(400).json({ success: false, message: err.message });
    }
    res.status(err.statusCode || 500).json({
        success: false,
        message: err.message || "Internal Server Error"
    });
};

module.exports = errorHandler;
