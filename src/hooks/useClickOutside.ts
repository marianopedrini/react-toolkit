import { useEffect, RefObject } from 'react';

/**
 * Custom hook to handle clicks outside of a specified element
 * @param ref - React ref object pointing to the element
 * @param handler - Function to call when click occurs outside the element
 * @param enabled - Whether the hook should be active (default: true)
 */
export function useClickOutside<T extends HTMLElement = HTMLElement>(
    ref: RefObject<T | null>,
    handler: (event: MouseEvent | TouchEvent) => void,
    enabled: boolean = true,
) {
    useEffect(() => {
        if (!enabled) return;

        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            // If the ref doesn't exist or the clicked element is inside the ref, do nothing
            if (!ref.current || ref.current.contains(event.target as Node)) {
                return;
            }

            // Call the handler
            handler(event);
        };

        // Add event listeners for both mouse and touch events
        document.addEventListener('mousedown', handleClickOutside);
        document.addEventListener('touchstart', handleClickOutside);

        // Cleanup event listeners
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [ref, handler, enabled]);
}
