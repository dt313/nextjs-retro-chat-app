'use client';

import { useSelector } from 'react-redux';

function ThemeWrapper({ children }) {
    const { theme } = useSelector((state) => state.theme);
    return <div data-theme={theme}>{children}</div>;
}

export default ThemeWrapper;
