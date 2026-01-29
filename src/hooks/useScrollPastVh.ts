import { useState, useEffect, useRef } from 'react';

/**
 * Custom hook que detecta cuando el scroll supera un valor específico en vh
 * @param vhThreshold - Valor en vh (por defecto 100vh)
 * @returns boolean - true si el scroll es mayor al threshold, false en caso contrario
 */
export const useScrollPastVh = (vhThreshold: number = 100): boolean => {
    const [isScrolledPast, setIsScrolledPast] = useState<boolean>(false);
    const lastUpdate = useRef<number>(0);

    useEffect(() => {
        const handleScroll = () => {
            const now = Date.now();

            // Si han pasado menos de 16ms desde la última ejecución, no hacer nada
            if (now - lastUpdate.current < 16) return; // 16ms = ~60fps

            lastUpdate.current = now;

            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const thresholdPixels = (viewportHeight * vhThreshold) / 100;

            setIsScrolledPast(scrollY > thresholdPixels);
        };

        // Ejecutar inmediatamente para establecer el estado inicial
        handleScroll();

        // Agregar event listener
        window.addEventListener('scroll', handleScroll, { passive: true });

        // Cleanup
        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [vhThreshold]);

    return isScrolledPast;
};
