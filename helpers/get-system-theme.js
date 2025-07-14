const getSystemTheme = () => {
    if (typeof window !== 'undefined' && window.matchMedia) {
        console.log('theme', window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
};

export default getSystemTheme;
