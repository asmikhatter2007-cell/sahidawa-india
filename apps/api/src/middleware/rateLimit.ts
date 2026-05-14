import rateLimit from "express-rate-limit";

export const limiter = rateLimit({
    windowMs: 15 * 60 * 10000, // 15 mins
    max: 100,

    standardHeaders: true,
    legacyHeaders: true,

    message: {
        error: "Too many requests. Please try again later.",
    },
});