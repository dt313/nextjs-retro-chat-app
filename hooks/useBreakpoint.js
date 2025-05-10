import { useEffect, useState } from 'react';

// Define breakpoints
export const breakpoints = {
    xs: 0,
    sm: 600,
    md: 768,
    lg: 1024,
    xl: 1280,
};

const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState('lg');

    useEffect(() => {
        const handleResize = () => {
            const width = window.innerWidth;

            if (width >= breakpoints.xl) {
                setBreakpoint('xl');
            } else if (width >= breakpoints.lg) {
                setBreakpoint('lg');
            } else if (width >= breakpoints.md) {
                setBreakpoint('md');
            } else if (width >= breakpoints.sm) {
                setBreakpoint('sm');
            } else {
                setBreakpoint('xs');
            }
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    return breakpoint;
};

export default useBreakpoint;
