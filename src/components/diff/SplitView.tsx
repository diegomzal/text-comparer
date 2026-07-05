import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DiffResult } from "@/hooks/useCompare";
import { cn } from "@/lib/utils";

interface SplitViewProps {
    diffResult: DiffResult;
    partToChange: Map<number, number>;
    activeChange: number;
}

export function SplitView({ diffResult, partToChange, activeChange }: SplitViewProps) {
    const leftRef = useRef<HTMLDivElement>(null);
    const rightRef = useRef<HTMLDivElement>(null);
    const suppressSync = useRef(false);

    useEffect(() => {
        const left = leftRef.current;
        const right = rightRef.current;

        if (!left || !right) return;

        const handleScroll = (source: HTMLDivElement, target: HTMLDivElement) => {
            if (suppressSync.current) return;
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
        if (activeChange < 0) return;

        // Each pane renders a span for every part (empty for the other
        // side's changes), so both can center their own copy. Pause the
        // scroll sync so the two programmatic scrolls don't fight.
        suppressSync.current = true;
        for (const pane of [leftRef.current, rightRef.current]) {
            pane
                ?.querySelector(`[data-change="${activeChange}"]`)
                ?.scrollIntoView({ block: "center" });
        }
        const id = setTimeout(() => {
            suppressSync.current = false;
        }, 100);
        return () => clearTimeout(id);
    }, [activeChange]);

    const renderPane = (side: "original" | "modified") => (
        <div className="p-6 font-mono text-sm whitespace-pre-wrap leading-relaxed">
            {diffResult.diffs.map((part, index) => {
                const change = partToChange.get(index);
                const visible = side === "original" ? !part.added : !part.removed;
                return (
                    <span
                        key={index}
                        data-change={change}
                        className={cn(
                            side === "original" && part.removed &&
                                "bg-red-100 text-red-800 line-through decoration-red-500 decoration-2 dark:bg-red-900/60 dark:text-red-100",
                            side === "modified" && part.added &&
                                "bg-green-100 text-green-800 font-bold dark:bg-green-600 dark:text-white",
                            visible && change === activeChange && (part.added || part.removed) &&
                                "outline-2 outline-offset-1 outline-blue-500"
                        )}
                    >
                        {visible && part.value}
                    </span>
                );
            })}
        </div>
    );

    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden w-0">
                <div className="p-3 bg-muted/50 border-b font-medium text-center text-xs text-muted-foreground uppercase tracking-widest">Original</div>
                <ScrollArea className="flex-1 w-full" viewportRef={leftRef}>
                    {renderPane("original")}
                </ScrollArea>
            </div>

            <div className="w-px bg-border shrink-0" />

            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden w-0">
                <div className="p-3 bg-muted/50 border-b font-medium text-center text-xs text-muted-foreground uppercase tracking-widest">Modified</div>
                <ScrollArea className="flex-1 w-full" viewportRef={rightRef}>
                    {renderPane("modified")}
                </ScrollArea>
            </div>
        </div>
    );
}
