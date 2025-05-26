import { useEffect, useState } from 'react';

function useDebounce(value, delay = 300) {
    const [debounceValue, setDebounceValue] = useState(value);

    useEffect(() => {
        const handler = setTimeout(() => {
            setDebounceValue(value);
        }, delay);

        return () => clearTimeout(handler);
    }, [value, delay]);

    return debounceValue;
}

export default useDebounce;
