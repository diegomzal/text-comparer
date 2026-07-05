import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DiffResult } from "@/hooks/useCompare";
import { cn } from "@/lib/utils";
import { addedClass, removedClass, activeChangeClass, centerChange, type ActiveChange } from "./view-utils";

interface SplitViewProps {
    diffResult: DiffResult;
    partToChange: Map<number, number>;
    activeChange: ActiveChange;
}

export function SplitView({ diffResult, partToChange, activeChange }: SplitViewProps) {
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const left = leftRef.current;
        const right = rightRef.current;

        if (!left || !right) return;

        const handleScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
            if (source.scrollTop !== target.scrollTop) {
                target.scrollTop = source.scrollTop;
            }
        };

        const onLeftScroll = () => handleScroll(left, right);
        const onRightScroll = () => handleScroll(right, left);

        left.addEventListener("scroll", onLeftScroll);
        right.addEventListener("scroll", onRightScroll);

        return () => {
            left.removeEventListener("scroll", onLeftScroll);
            right.removeEventListener("scroll", onRightScroll);
        };
    }, []);

    useEffect(() => {
        if (!activeChange) return;
        // The panes share an identical layout, so one computed offset
        // centers the change in both and stays consistent with the sync.
        centerChange(leftRef.current, activeChange.index);
        if (leftRef.current && rightRef.current) {
            rightRef.current.scrollTop = leftRef.current.scrollTop;
        }
    }, [activeChange]);

    const renderPane = (side: "original" | "modified") => (
        <div className="p-6 font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {diffResult.diffs.map((part, index) => {
                const change = partToChange.get(index);
                const hidden = side === "original" ? part.added : part.removed;
                return (
                    <span
                        key={index}
                        data-change={change}
                        aria-hidden={hidden || undefined}
                        className={cn(
                            part.added && addedClass,
                            part.removed && removedClass,
                            activeChange != null && change === activeChange.index && activeChangeClass,
                            // The other side's text stays in the flow (invisible)
                            // so both panes wrap identically and line up at the
                            // same scroll offsets.
                            hidden && "invisible select-none"
                        )}
                    >
                        {part.value}
                    </span>
                );
            })}
        </div>
    );

    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden min-w-0">
                <div className="p-3 bg-muted/50 border-b font-medium text-center text-xs text-muted-foreground uppercase tracking-widest">Original</div>
                <ScrollArea className="flex-1 w-full" viewportRef={leftRef}>
                    {renderPane("original")}
                </ScrollArea>
            </div>

            <div className="w-px bg-border shrink-0" />

            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden min-w-0">
                <div className="p-3 bg-muted/50 border-b font-medium text-center text-xs text-muted-foreground uppercase tracking-widest">Modified</div>
                <ScrollArea className="flex-1 w-full" viewportRef={rightRef}>
                    {renderPane("modified")}
                </ScrollArea>
            </div>
        </div>
    );
}
