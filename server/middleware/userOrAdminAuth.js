import jwt from 'jsonwebtoken'
import wrapAsync from '../utils/wrapAsync.js'
import User from '../models/User.js';

const userOrAdminAuth = wrapAsync(async (req, res, next) => {
    const authHeader = req.headers.authorization
    if (!authHeader) {
        return res.status(401).json({
            success: false,
            message: "Not Authorized. Login Again"
        });
    }

    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if(decoded.email === process.env.ADMIN_EMAIL){
        req.isAdmin = true;
        req.user = null;
        return next();
    }

    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    }

    req.isAdmin = false;
    req.user = user;

    next();
});

export default userOrAdminAuth;