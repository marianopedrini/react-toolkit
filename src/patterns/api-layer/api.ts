const BACKEND_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL; // publicEnv.backendBaseURL

interface ApiRequestOptions extends RequestInit {
    tags?: string[];
}

// Common fetch wrapper with error handling
async function apiRequest<T>(
    endpoint: string,
    options: ApiRequestOptions = {},
): Promise<T> {
    const { tags, ...restOptions } = options;
    const url = `${BACKEND_BASE_URL}${endpoint}`;

    const config: RequestInit = {
        headers: {
            'Content-Type': 'application/json',
            ...restOptions.headers,
        },
        ...restOptions,
        ...(tags && tags.length > 0 && { next: { tags } }),
    };

    try {
        const response = await fetch(url, config);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(`API request failed for ${url}:`, error);
        throw error;
    }
}

/**
 * Fetches a specific page detail by slug or ID
 * @param slug - The page slug or identifier
 * @returns Promise with page detail data
 */
export async function getPage(slug: string): Promise<any> {
    const urlPath = slug === '/' ? '/' : `/${slug}/`;
    const data = await apiRequest(`/api/page?url=${urlPath}`, {
        tags: [`page_${urlPath}`],
    });
    return data;
}
