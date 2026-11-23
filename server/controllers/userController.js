import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import wrapAsync from "../utils/wrapAsync.js";

export const registerUser = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({
                success: false,
                message: "All fields are required"
            });
        }

        if (password.length < 8) {
            return res.status(400).json({
                success: false,
                message: "Password must be at least 8 characters"
            });
        }

        // Check existing user
        const existingUser = await User.findOne({ email });

        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword
        });

        // Generate JWT
        const token = jwt.sign(
            {
                id: user._id,
                role: user.role
            },
            process.env.JWT_SECRET,
            { expiresIn: "7d" }
        );

        res.status(201).json({
            success: true,
            message: "Account created successfully",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        // Handle duplicate email race condition
        if (error.code === 11000) {
            return res.status(409).json({
                success: false,
                message: "Email already registered"
            });
        }

        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

export const loginUser = wrapAsync(async(req, res) => {
    const {email, password} = req.body;

    // validate input
    if(!email || !password){
        return res.staatus(400).json({
            success: false,
            message: "Email and password are required"
        });
    }

    // Find user
    const user = await User.findOne({
        email: email.trim().toLowerCase()
    });

    if(!user){
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // compare password
    const isPasswordValid = await bcrypt.compare(
        password,
        user.password
    );

    if(!isPasswordValid){
        return res.status(401).json({
            success: false,
            message: "Invalid email or password"
        });
    }

    // Generate JWT
    const token = jwt.sign(
        {
            id: user._id,
            role: user.role
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
    );

    res.status(200).json({
        success: true,
        message: "Login successful",
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    });



});