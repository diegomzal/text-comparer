import { useRef, useEffect } from "react";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DiffResult } from "@/hooks/useCompare";
import { cn } from "@/lib/utils";

export function SplitView({ diffResult }: { diffResult: DiffResult }) {
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

    return (
        <div className="flex h-full">
            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden w-0">
                <div className="p-3 bg-neutral-900/50 border-b border-neutral-800 font-medium text-center text-xs text-neutral-400 uppercase tracking-widest">Original</div>
                <ScrollArea className="flex-1 w-full" viewportRef={leftRef}>
                    <div className="p-6 font-mono text-sm whitespace-pre-wrap leading-relaxed text-neutral-300">
                        {diffResult.diffs.map((part, index) => (
                            <span
                                key={index}
                                className={cn(
                                    part.removed && "bg-red-900/60 text-red-100 decoration-red-500 line-through decoration-2"
                                )}
                            >
                                {!part.added && part.value}
                            </span>
                        ))}
                    </div>
                </ScrollArea>
            </div>

            <div className="w-px bg-neutral-800 shrink-0" />

            <div className="flex-1 flex flex-col h-full min-h-0 overflow-hidden w-0">
                <div className="p-3 bg-neutral-900/50 border-b border-neutral-800 font-medium text-center text-xs text-neutral-400 uppercase tracking-widest">Modified</div>
                <ScrollArea className="flex-1 w-full" viewportRef={rightRef}>
                    <div className="p-6 font-mono text-sm whitespace-pre-wrap leading-relaxed text-neutral-300">
                        {diffResult.diffs.map((part, index) => (
                            <span
                                key={index}
                                className={cn(
                                    part.added && "bg-green-600 text-white font-bold"
                                )}
                            >
                                {!part.removed && part.value}
                            </span>
                        ))}
                    </div>
                </ScrollArea>
            </div>
        </div>
    );
}
