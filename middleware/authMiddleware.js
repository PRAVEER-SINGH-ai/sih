const jwt = require("jsonwebtoken");
const User = require("../models/User");

const verifyJWT = async (req, res, next) => {
    try {
        // =====================================
        // Get token
        // =====================================

        let token = req.cookies?.accessToken;

        // Also allow Authorization header
        // Useful for frontend/mobile/API clients

        if (
            !token &&
            req.headers.authorization &&
            req.headers.authorization.startsWith("Bearer ")
        ) {
            token =
                req.headers.authorization.split(" ")[1];
        }


        // =====================================
        // No token
        // =====================================

        if (!token) {
            return res.status(401).json({
                success: false,
                message: "Authentication required"
            });
        }


        // =====================================
        // Verify token
        // =====================================

        const decoded =
            jwt.verify(
                token,
                process.env.ACCESS_TOKEN_SECRET
            );


        // =====================================
        // Find user
        // =====================================

        const user =
            await User.findById(decoded._id)
                .select("-password -refreshToken");


        if (!user) {
            return res.status(401).json({
                success: false,
                message: "User no longer exists"
            });
        }


        // =====================================
        // Attach user to request
        // =====================================

        req.user = user;

        next();

    } catch (error) {

        return res.status(401).json({
            success: false,
            message: "Invalid or expired access token"
        });
    }
};


module.exports = {
    verifyJWT
};