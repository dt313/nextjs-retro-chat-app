import { useEffect, useState } from 'react';

// Define breakpoints
export const breakpoints = {
    xs: 0,
    sm: 600,
    md: 768,
    lg: 1024,
    xl: 1280,
};

const getCurrentBreakpoint = () => {
    if (typeof window === 'undefined') {
        return 'lg'; // Default trên server, chọn breakpoint phù hợp
    }
    const width = window.innerWidth;

    if (width >= breakpoints.xl) return 'xl';
    if (width >= breakpoints.lg) return 'lg';
    if (width >= breakpoints.md) return 'md';
    if (width >= breakpoints.sm) return 'sm';
    return 'xs';
};

const useBreakpoint = () => {
    const [breakpoint, setBreakpoint] = useState(getCurrentBreakpoint());

    useEffect(() => {
        const handleResize = () => {
            setBreakpoint(getCurrentBreakpoint());
        };

        // Initial check
        handleResize();

        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [breakpoint]);

    return breakpoint;
};

export default useBreakpoint;
