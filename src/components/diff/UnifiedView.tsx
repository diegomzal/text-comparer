import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DiffResult } from "@/hooks/useCompare";
import { cn } from "@/lib/utils";

interface UnifiedViewProps {
    diffResult: DiffResult;
    partToChange: Map<number, number>;
    activeChange: number;
}

export function UnifiedView({ diffResult, partToChange, activeChange }: UnifiedViewProps) {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (activeChange < 0) return;
        contentRef.current
            ?.querySelector(`[data-change="${activeChange}"]`)
            ?.scrollIntoView({ block: "center", behavior: "smooth" });
    }, [activeChange]);

    return (
        <ScrollArea className="h-full">
            <div ref={contentRef} className="p-8 font-mono text-sm whitespace-pre-wrap leading-relaxed mx-auto">
                {diffResult.diffs.map((part, index) => {
                    const change = partToChange.get(index);
                    return (
                        <span
                            key={index}
                            data-change={change}
                            className={cn(
                                part.added && "bg-green-100 text-green-800 font-bold dark:bg-green-600 dark:text-white",
                                part.removed && "bg-red-100 text-red-800 line-through decoration-red-500 dark:bg-red-900/60 dark:text-red-100",
                                change === activeChange && "outline-2 outline-offset-1 outline-blue-500"
                            )}
                        >
                            {part.value}
                        </span>
                    );
                })}
            </div>
        </ScrollArea>
    );
}
