const jwt = require("jsonwebtoken");
const User = require("../models/User");

const authMiddleware = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        const tokenParts = authHeader ? authHeader.split(" ") : [];

        if (tokenParts.length !== 2 || tokenParts[0] !== "Bearer") {
            return res.status(401).json({
                success: false,
                message: "A valid Bearer access token is required"
            });
        }

        const decoded = jwt.verify(tokenParts[1], process.env.JWT_ACCESS_SECRET);
        const user = await User.findById(decoded.userId).select("role isActive");

        if (!user || !user.isActive) {
            return res.status(401).json({
                success: false,
                message: "User account is inactive or no longer available"
            });
        }

        req.user = { userId: user._id, role: user.role };
        next();
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token"
        });
    }
};

module.exports = authMiddleware;
