// import jwt from "jsonwebtoken";

// const authMiddleware = async (req, res, next) => {
//     const { token } = req.headers;

//     // Check if token is provided
//     if (!token) {
//         return res.status(401).json({ success: false, message: "Not authorized, login required" });
//     }

//     try {
//         // Decode the token
//         const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

//         // Attach the decoded user information to the request object
//         req.user = decodedToken;

//         // Proceed to the next middleware or controller
//         next();
//     } catch (error) {
//         console.log(error);
//         return res.status(403).json({ success: false, message: "Invalid token" });
//     }
// };

// export default authMiddleware;


import jwt from "jsonwebtoken";

const authMiddleware = async (req, res, next) => {
    // Check both Authorization header and token key
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
        ? authHeader.split(" ")[1] // Extract token from Authorization header
        : req.headers.token; // Fallback to token key

    // Check if a token was provided
    if (!token) {
        return res.status(401).json({
            success: false,
            message: "Not authorized, login required",
        });
    }

    try {
        // Verify the token using the secret key
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
        console.log(process.env.JWT_SECRET)
        console.log("Decoded Token in Middleware:", decodedToken);
        // Attach the decoded token payload to the request object
        req.user = decodedToken;

        // Proceed to the next middleware/controller
        next();
    } catch (error) {
        console.error("JWT Error:", error.message);

        // Handle specific token errors
        if (error.name === "TokenExpiredError") {
            return res.status(403).json({
                success: false,
                message: "Token expired",
            });
        }

        // Default error response for invalid tokens
        return res.status(403).json({
            success: false,
            message: "Invalid token",
        });
    }
};

export default authMiddleware;
