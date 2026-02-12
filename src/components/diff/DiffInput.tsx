import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"

interface DiffInputProps {
    original: string;
    setOriginal: (value: string) => void;
    modified: string;
    setModified: (value: string) => void;
}

export function DiffInput({ original, setOriginal, modified, setModified }: DiffInputProps) {
    return (
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-6 min-h-0 pb-4">
            <Card className="flex flex-col h-full border-muted/40 bg-card/50">
                <CardHeader className="pb-3 shrink-0">
                    <CardTitle>Original Text</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 relative min-h-0">
                    <Textarea
                        placeholder="Paste original text here..."
                        className="h-full w-full resize-none border-0 focus-visible:ring-0 p-4 text-base font-mono leading-relaxed bg-muted/30"
                        value={original}
                        onChange={(e) => setOriginal(e.target.value)}
                    />
                </CardContent>
            </Card>

            <Card className="flex flex-col h-full border-muted/40 bg-card/50">
                <CardHeader className="pb-3 shrink-0">
                    <CardTitle>Modified Text</CardTitle>
                </CardHeader>
                <CardContent className="flex-1 relative min-h-0">
                    <Textarea
                        placeholder="Paste modified text here..."
                        className="h-full w-full resize-none border-0 focus-visible:ring-0 p-4 text-base font-mono leading-relaxed bg-muted/30"
                        value={modified}
                        onChange={(e) => setModified(e.target.value)}
                    />
                </CardContent>
            </Card>
        </div>
    )
}
