import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DiffResult, DiffType } from "@/hooks/useCompare";
import { getDiffStats } from "@/lib/diff-stats";
import type { ActiveChange } from "./view-utils";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useMemo, useState } from "react";
import { SplitView } from "./SplitView";
import { UnifiedView } from "./UnifiedView";

const UNIT_LABELS: Record<DiffType, string> = {
    chars: "characters",
    words: "words",
    lines: "lines",
};

interface CompareModalProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    diffResult: DiffResult | null;
    diffType: DiffType;
    setDiffType: (type: DiffType) => void;
}

export function CompareModal({
    open,
    onOpenChange,
    diffResult,
    diffType,
    setDiffType,
}: CompareModalProps) {
    const [isUnified, setIsUnified] = useState(false);
    const [activeChange, setActiveChange] = useState<ActiveChange>(null);

    const stats = useMemo(
        () => (diffResult ? getDiffStats(diffResult.diffs) : null),
        [diffResult]
    );

    // Reset navigation when a new comparison comes in.
    const [lastDiffResult, setLastDiffResult] = useState(diffResult);
    if (diffResult !== lastDiffResult) {
        setLastDiffResult(diffResult);
        setActiveChange(null);
    }

    if (!diffResult || !stats) return null;

    const { changeCount } = stats;

    // A fresh object per click so the views re-center even when the index
    // is unchanged (single difference, or the user scrolled away).
    const goToNext = () =>
        setActiveChange((a) => ({ index: ((a?.index ?? -1) + 1) % changeCount }));
    const goToPrev = () =>
        setActiveChange((a) => ({
            index: a == null || a.index === 0 ? changeCount - 1 : a.index - 1,
        }));

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="w-[96vw] max-w-[96vw] sm:max-w-[96vw] h-[92vh] flex flex-col p-0 gap-0">
                <DialogHeader className="px-6 py-4 pr-14 border-b shrink-0">
                    <DialogTitle className="sr-only">Text Comparison</DialogTitle>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <Switch
                                    id="unified-mode"
                                    checked={isUnified}
                                    onCheckedChange={setIsUnified}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                                <Label htmlFor="unified-mode" className="font-medium select-none cursor-pointer">Unified View</Label>
                            </div>

                            <div className="h-4 w-px bg-border" />

                            <Tabs value={diffType} onValueChange={(v) => setDiffType(v as DiffType)}>
                                <TabsList className="h-8">
                                    <TabsTrigger value="chars" className="text-xs px-3 h-6">Char</TabsTrigger>
                                    <TabsTrigger value="words" className="text-xs px-3 h-6">Word</TabsTrigger>
                                    <TabsTrigger value="lines" className="text-xs px-3 h-6">Line</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>

                        <div className="flex items-center gap-4">
                            <span
                                className="text-sm text-muted-foreground tabular-nums"
                                title={`${stats.added} ${UNIT_LABELS[diffType]} added, ${stats.removed} removed`}
                            >
                                <span className="text-green-600 dark:text-green-400 font-medium">+{stats.added}</span>
                                {' '}
                                <span className="text-red-600 dark:text-red-400 font-medium">−{stats.removed}</span>
                            </span>

                            <div className="flex items-center gap-1">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-7"
                                    onClick={goToPrev}
                                    disabled={changeCount === 0}
                                    aria-label="Previous difference"
                                >
                                    <ChevronUp />
                                </Button>
                                <span className="text-xs text-muted-foreground tabular-nums min-w-24 text-center select-none">
                                    {changeCount === 0
                                        ? "No differences"
                                        : activeChange == null
                                            ? `${changeCount} difference${changeCount === 1 ? "" : "s"}`
                                            : `${activeChange.index + 1} / ${changeCount}`}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    className="size-7"
                                    onClick={goToNext}
                                    disabled={changeCount === 0}
                                    aria-label="Next difference"
                                >
                                    <ChevronDown />
                                </Button>
                            </div>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 min-h-0 bg-muted/30 overflow-hidden">
                    {isUnified ? (
                        <UnifiedView diffResult={diffResult} partToChange={stats.partToChange} activeChange={activeChange} />
                    ) : (
                        <SplitView diffResult={diffResult} partToChange={stats.partToChange} activeChange={activeChange} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
