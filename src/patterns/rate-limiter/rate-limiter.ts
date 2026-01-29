// In-memory rate limiter using sliding window algorithm
// Note: This works per instance, so in serverless environments
// each instance maintains its own state
//
// !IMPORTANT:
// If the application runs on multiple instances behind a load balancer,
// this approach does NOT guarantee global limits, as each instance handles its own state.
// In that case, it's recommended to use a centralized storage approach (Redis for example)
// to ensure consistent rate limiting across all instances.

const rateLimitStore = new Map<string, number[]>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 60 seconds
const RATE_LIMIT_MAX_REQUESTS = 150; // 150 requests per window

export function checkRateLimit(identifier: string): {
    success: boolean;
    limit: number;
    remaining: number;
    reset: number;
} {
    const now = Date.now();
    const windowStart = now - RATE_LIMIT_WINDOW_MS;

    // Get timestamps for this identifier
    let timestamps = rateLimitStore.get(identifier) || [];

    // Filter out timestamps outside the window
    timestamps = timestamps.filter((timestamp) => timestamp > windowStart);

    const remaining = Math.max(0, RATE_LIMIT_MAX_REQUESTS - timestamps.length);
    const reset = Math.ceil((windowStart + RATE_LIMIT_WINDOW_MS) / 1000);

    if (timestamps.length >= RATE_LIMIT_MAX_REQUESTS) {
        // Update storage with new timestamps
        rateLimitStore.set(identifier, timestamps);
        return {
            success: false,
            limit: RATE_LIMIT_MAX_REQUESTS,
            remaining: 0,
            reset,
        };
    }

    // Add new timestamp and update store
    timestamps.push(now);
    rateLimitStore.set(identifier, timestamps);

    // Cleanup: periodically remove old entries to avoid memory leaks
    if (Math.random() < 0.01) {
        // 1% chance of cleanup
        for (const [key, value] of rateLimitStore.entries()) {
            const filtered = value.filter((t) => t > windowStart);
            if (filtered.length === 0) {
                rateLimitStore.delete(key);
            } else {
                rateLimitStore.set(key, filtered);
            }
        }
    }

    return {
        success: true,
        limit: RATE_LIMIT_MAX_REQUESTS,
        remaining: remaining - 1,
        reset,
    };
}
