function requireEnv(value: string | undefined, key: string): string {
    if (!value || value.trim() === '') {
        throw new Error(`Missing required environment variable: ${key}`);
    }
    return value;
}

export const publicEnv = {
    get backendBaseURL() {
        return requireEnv(
            process.env.NEXT_PUBLIC_BACKEND_BASE_URL,
            'NEXT_PUBLIC_BACKEND_BASE_URL',
        );
    },
    get siteUrl() {
        return process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    },
    // ...
} as const;

export const serverEnv = {
    get directLineSecret() {
        return requireEnv(process.env.DIRECTLINE_SECRET, 'DIRECTLINE_SECRET');
    },
    // ...
} as const;
