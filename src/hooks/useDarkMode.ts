import { useEffect, useState } from "react";

export function checkIsDarkMode() {
    try {
        return window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch (err) {
        return false;
    }
}

function useDarkMode() {
    // 是否暗色
    const [isDark, setIsDark] = useState(checkIsDarkMode())

    useEffect(() => {
        let mqList = window.matchMedia('(prefers-color-scheme: dark)')

        const listener = (event) => {
            setIsDark(event.matches);
        };

        mqList.addEventListener('change', listener);
        return () => {
            mqList.removeEventListener('change', listener);
        };
    }, [])

    return isDark
}

export default useDarkMode