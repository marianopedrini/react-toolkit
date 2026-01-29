// Declare external modules so TypeScript doesn't error on imports
// for libraries not installed in this repo
declare module 'next/link';
declare module 'next/image';
declare module 'next/navigation';
declare module 'next/server' {
    export class NextResponse extends Response {
        static json(body: unknown, init?: ResponseInit): NextResponse;
    }
}

declare module 'clsx' {
    export type ClassValue =
        | string
        | number
        | boolean
        | undefined
        | null
        | ClassValue[];
    export function clsx(...inputs: ClassValue[]): string;
}
declare module 'tailwind-merge';

declare module '@tanstack/react-query' {
    export function useQuery(options: any): any;
    export function useMutation(options: any): any;
}

