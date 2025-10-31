import { ratelimit } from "../config/upstash.js";

export const ratelimiter = async (req, resizeBy, next) => {
  try {
    const { success } = await ratelimit.limit("My-limit-key");
    if (!success) {
      return res.status(429).json({
        message: "too many request please try again later",
      });
    }
    next();
  } catch (error) {
    console.log("ratelimiterror", error);
    next(error);
  }
};
