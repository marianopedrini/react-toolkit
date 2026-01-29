import { useCallback, useRef } from 'react';

interface UseScrollToOptions {
    offset?: number;
    behavior?: ScrollBehavior;
}

export const useScrollTo = <T extends HTMLElement>(
    options: UseScrollToOptions = {},
) => {
    const { offset = 0, behavior = 'smooth' } = options;
    const ref = useRef<T>(null);

    const scrollToElement = useCallback(() => {
        if (ref.current) {
            const elementPosition = ref.current.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.scrollY - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior,
            });
        }
    }, [offset, behavior]);

    return { ref, scrollToElement };
};
