import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import rateLimit from "express-rate-limit";
import jwt from "jsonwebtoken";
import winston from "winston";
import morgan from "morgan";

import Users from "./Models/UserModel.js";

dotenv.config();

if (!process.env.MONGO_URI || !process.env.PORT) {
    throw new Error("MONGO_URI and PORT environment variables are required");
}

// Configure Winston logger
const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(
        winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
        winston.format.printf(({ timestamp, level, message }) => {
            return `${timestamp} [${level.toUpperCase()}]: ${message}`;
        })
    ),
    transports: [
        new winston.transports.Console(),
        new winston.transports.File({ filename: 'logs/app.log' }),
    ],
});

// Configure Morgan to use Winston for HTTP request logging
const app = express();
app.use(
    morgan('combined', {
        stream: {
            write: (message) => logger.info(message.trim()),
        },
    })
);

// Middleware
const healthLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100,
    message: "Too many requests from this DDoS attacker, please try again later",
});

app.use(cors());
app.use(express.json({ limit: "5mb" }));

// MongoDB connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => logger.info("Connected to MongoDB"))
    .catch((err) => {
        logger.error(`MongoDB connection error: ${err.message}`);
        process.exit(1);
    });

// Health check endpoint
app.get("/api/health", healthLimiter, (_, res) => {
    logger.info("Health check requested");
    res.status(200).json({ success: true, message: "Server is healthy" });
});

// JWT authentication middleware
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization']; // Fixed typo: 'autherization' to 'authorization'
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        logger.warn("Access token missing in request");
        return res.status(401).json({ error: "Access token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_TOKEN || "asicewkn4f");
        req.user = decoded;
        next();
    } catch (err) {
        logger.warn(`Invalid or expired token: ${err.message}`);
        res.status(403).json({ error: "Invalid or expired token" });
    }
};

app.post("/api/users", async (req, res) => {
    try {
        const { username, email, password, profilePicture } = req.body;

        const existingUser = await Users.findOne({ email });
        if (existingUser) {
            logger.warn(`Failed registration attempt: Email already in use - ${email}`);
            return res.status(400).json({ error: "Email already in use" });
        }

        if (!password || password.length < 8) {
            logger.warn(`Failed registration attempt: Password too short for email - ${email}`);
            return res.status(400).json({ error: "Password must contain at least 8 characters" });
        }

        const randomSeed = Math.random().toString(36).substring(2, 15);
        const avatarUrl = `https://api.dicebear.com/8.x/notionists-neutral/svg?seed=${randomSeed}`;

        const saltRounds = 10;
        const hashPassword = await bcrypt.hash(password, saltRounds);

        const post = new Users({
            username,
            email,
            password: hashPassword,
            profilePicture: avatarUrl,
        });

        await post.save();
        logger.info(`User registered successfully: ${email} (ID: ${post._id})`);
        res.status(201).json(post);
    } catch (err) {
        logger.error(`Error during registration for email ${req.body.email}: ${err.message}`);
        res.status(400).json({ error: err.message });
    }
});

// Login endpoint
app.post("/api/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await Users.findOne({ email });
        if (!user) {
            logger.warn(`Failed login attempt: Email not found - ${email}`);
            return res.status(400).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Failed login attempt: Incorrect password for email - ${email}`);
            return res.status(400).json({ error: "Invalid email or password" });
        }

        // Generate token
        const token = jwt.sign(
            { id: user._id, email: user.email }, // Include user ID in the token
            process.env.JWT_TOKEN || 'asicewkn4f',
            { expiresIn: '1h' }
        );

        logger.info(`User logged in successfully: ${email} (ID: ${user._id})`);
        res.status(200).json({
            message: "Login successful",
            token,
            user: { id: user._id, email: user.email, userName: user.username },
        });
    } catch (err) {
        logger.error(`Error during login for email ${req.body.email}: ${err.message}`);
        res.status(400).json({ error: err.message });
    }
});

// Get all users
app.get("/api/users", async (req, res) => {
    try {
        const users = await Users.find().select('-password');
        logger.info(`Retrieved list of all users (total: ${users.length})`);
        res.status(200).json(users); // Fixed status code: 400 to 200
    } catch (err) {
        logger.error(`Error retrieving users: ${err.message}`);
        res.status(500).json({ error: err.message }); // Fixed status code: 400 to 500
    }
});

// Get logged-in user's data
app.get("/api/users/me", authenticateToken, async (req, res) => {
    try {
        // Validate the user ID from the JWT
        if (!mongoose.Types.ObjectId.isValid(req.user.id)) {
            logger.warn(`Invalid user ID in token: ${req.user.id}`);
            return res.status(400).json({ error: "Invalid user ID" });
        }

        const user = await Users.findById(req.user.id).select('-password');
        if (!user) {
            logger.warn(`User not found for ID: ${req.user.id}`);
            return res.status(404).json({ error: "User not found" });
        }

        logger.info(`User data retrieved successfully for ID: ${req.user.id}`);
        res.status(200).json(user);
    } catch (err) {
        logger.error(`Error retrieving user data for ID ${req.user.id}: ${err.message}`);
        res.status(500).json({ error: err.message });
    }
});

// Global error handler
app.use((err, req, res, next) => {
    logger.error(`Unhandled error: ${err.message}`);
    res.status(500).json({ success: false, message: "Something went wrong on the server" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    logger.info(`Server running on port ${PORT}`);
});
