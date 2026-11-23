import jwt from "jsonwebtoken";
import wrapAsync from "../utils/wrapAsync.js";
import User from "../models/User.js";

const auth = wrapAsync(async (req,res,next) => {
    const token = req.headers.authorization;
    if(!token){
        return res.status(401).json({
            success: false,
            message: "Not Authorized. Login Again"
        });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    if(!user){
        return res.status(401).json({
            success: false,
            message: "User not found"
        });
    }

    req.user = user;

    next();

});

export default auth;