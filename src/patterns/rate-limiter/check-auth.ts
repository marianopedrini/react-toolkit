import { NextResponse } from 'next/server';
import crypto from 'crypto';

import { checkRateLimit } from '@/patterns/rate-limiter/rate-limiter';

export type AuthCheckResult =
    | {
          success: true;
          rateLimit: {
              limit: number;
              remaining: number;
              reset: number;
          };
      }
    | {
          success: false;
          response: NextResponse;
      };

export async function checkAuthAndRateLimit(
    request: Request,
): Promise<AuthCheckResult> {
    // Get client identifier (IP address or forwarded IP)
    const clientIp =
        request.headers.get('x-forwarded-for')?.split(',')[0] ||
        request.headers.get('x-real-ip') ||
        'unknown';

    // In-memory rate limiting
    const { success, limit, remaining, reset } = checkRateLimit(clientIp);

    if (!success) {
        return {
            success: false,
            response: NextResponse.json(
                { error: 'Rate limit exceeded' },
                {
                    status: 429,
                    headers: {
                        'X-RateLimit-Limit': String(limit),
                        'X-RateLimit-Remaining': String(remaining),
                        'X-RateLimit-Reset': String(reset),
                    },
                },
            ),
        };
    }

    // Check authentication
    const authHeader = request.headers.get('authorization');
    const expectedToken = process.env.PREVIEW_SECRET;

    if (!expectedToken) {
        return {
            success: false,
            response: NextResponse.json(
                { error: 'Server configuration error' },
                { status: 500 },
            ),
        };
    }

    if (!authHeader || !authHeader.startsWith('Token ')) {
        return {
            success: false,
            response: NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 },
            ),
        };
    }

    const providedToken = authHeader.replace('Token ', '');

    if (
        providedToken.length !== expectedToken.length ||
        !crypto.timingSafeEqual(
            Buffer.from(providedToken),
            Buffer.from(expectedToken),
        )
    ) {
        return {
            success: false,
            response: NextResponse.json(
                { error: 'Invalid token' },
                { status: 403 },
            ),
        };
    }

    return {
        success: true,
        rateLimit: { limit, remaining, reset },
    };
}
