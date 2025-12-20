import type { Request, Response } from "express";
import User from "../modals/User";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/token";

export const registerUser = async (req: Request, res: Response) => {
    const { email, password, name, avatar } = req.body;

    try {
        // check if user already exists
        let user = await User.findOne({ email });
        if (user) {
            res.status(400).json({ success: false, message: "User already exists" });
        }

        user = new User({ email, password, name, avatar: avatar || "https://ui-avatars.com/api/?name=" + name });

        // hash password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt)

        await user.save();

        // gen token 
        const token = generateToken(user);

        res.json({ success: true, token, message: "User registered successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}

export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    try {
        // find user by email
        const user = await User.findOne({ email });
        if (!user) {
            res.status(400).json({ success: false, message: "Invalid credentials" });
            return;
        }

        // compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            res.status(400).json({ success: false, message: "Invalid credentials" });
            return;
        }

        // gen token 
        const token = generateToken(user);

        res.json({ success: true, token, message: "User logged in successfully" });
    } catch (error) {
        res.status(500).json({ success: false, message: "Internal server error" });
    }
}