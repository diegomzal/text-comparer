import { useEffect, useRef } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DiffResult } from "@/hooks/useCompare";
import { cn } from "@/lib/utils";
import { addedClass, removedClass, activeChangeClass, centerChange, type ActiveChange } from "./view-utils";

interface UnifiedViewProps {
    diffResult: DiffResult;
    partToChange: Map<number, number>;
    activeChange: ActiveChange;
}

export function UnifiedView({ diffResult, partToChange, activeChange }: UnifiedViewProps) {
    const viewportRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!activeChange) return;
        centerChange(viewportRef.current, activeChange.index);
    }, [activeChange]);

    return (
        <ScrollArea className="h-full" viewportRef={viewportRef}>
            <div className="p-8 font-mono text-sm whitespace-pre-wrap leading-relaxed">
                {diffResult.diffs.map((part, index) => {
                    const change = partToChange.get(index);
                    return (
                        <span
                            key={index}
                            data-change={change}
                            className={cn(
                                part.added && addedClass,
                                part.removed && removedClass,
                                activeChange != null && change === activeChange.index && activeChangeClass
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
