import jwt from "jsonwebtoken"
import wrapAsync from "../utils/wrapAsync.js"

const adminAuth = wrapAsync(async (req, res, next) => {
    const token = req.headers.authorization;

    if(!token){
        return res.status(401).json({
            success: false,
            message: "Not Authorized, Login Again"
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if(decoded.email !== process.env.ADMIN_EMAIL){
        return res.status(403).json({
            success: false,
            message: "Admin access required"
        });
    }
    next();
});

export default adminAuth;