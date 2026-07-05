import { useCallback, useEffect, useState } from 'react';

export type Theme = 'light' | 'dark';

// localStorage throws in environments that block site data (strict cookie
// settings, sandboxed iframes) — treat it as best-effort.
function readStoredTheme(): string | null {
    try {
        return localStorage.getItem('theme');
    } catch {
        return null;
    }
}

function getInitialTheme(): Theme {
    const stored = readStoredTheme();
    if (stored === 'light' || stored === 'dark') return stored;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export function useTheme() {
    const [theme, setTheme] = useState<Theme>(getInitialTheme);

    useEffect(() => {
        // Applied to <html> so portaled content (dialogs) is themed too.
        // The inline script in index.html sets the initial class before
        // first paint; this keeps it in sync with toggles.
        document.documentElement.classList.toggle('dark', theme === 'dark');
        try {
            localStorage.setItem('theme', theme);
        } catch {
            // storage blocked; theme just won't persist
        }
    }, [theme]);

    const toggleTheme = useCallback(() => {
        setTheme((t) => (t === 'dark' ? 'light' : 'dark'));
    }, []);

    return { theme, toggleTheme };
}
