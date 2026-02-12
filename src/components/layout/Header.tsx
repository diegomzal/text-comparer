import { Button } from "@/components/ui/button"

interface HeaderProps {
    onCompare: () => void;
}

export function Header({ onCompare }: HeaderProps) {
    return (
        <header className="mb-4 shrink-0 flex items-center justify-between">
            <div>
                <h1 className="text-2xl font-bold tracking-tight">Text Comparer</h1>
                <p className="text-muted-foreground text-sm">Paste your text below to compare differences.</p>
            </div>
            <Button onClick={onCompare}>Compare</Button>
        </header>
    )
}
