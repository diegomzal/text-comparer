import { Moon, Sun } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Theme } from "@/hooks/useTheme"

interface HeaderProps {
    onCompare: () => void;
    theme: Theme;
    onToggleTheme: () => void;
}

export function Header({ onCompare, theme, onToggleTheme }: HeaderProps) {
    return (
        <header className="mb-4 shrink-0 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Text Comparer</h1>
                <p className="text-muted-foreground text-sm">Paste your text below to compare differences.</p>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="ghost" size="icon" onClick={onToggleTheme} aria-label="Toggle theme">
                    {theme === 'dark' ? <Sun /> : <Moon />}
                </Button>
                <Button onClick={onCompare}>Compare</Button>
            </div>
        </header>
    )
}
