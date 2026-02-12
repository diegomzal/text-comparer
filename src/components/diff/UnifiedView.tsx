import { ScrollArea } from "@/components/ui/scroll-area";
import type { DiffResult } from "@/hooks/useCompare";
import { cn } from "@/lib/utils";

export function UnifiedView({ diffResult }: { diffResult: DiffResult }) {
    return (
        <ScrollArea className="h-full">
            <div className="p-8 font-mono text-sm whitespace-pre-wrap leading-relaxed mx-auto text-neutral-300">
                {diffResult.diffs.map((part, index) => (
                    <span
                        key={index}
                        className={cn(
                            part.added && "bg-green-600 text-white font-bold",
                            part.removed && "bg-red-900/60 text-red-100 line-through decoration-red-500",
                        )}
                    >
                        {part.value}
                    </span>
                ))}
            </div>
        </ScrollArea>
    );
}
