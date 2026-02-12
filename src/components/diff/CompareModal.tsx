import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { DiffResult, DiffType } from "@/hooks/useCompare";
import { useState } from "react";
import { SplitView } from "./SplitView";
import { UnifiedView } from "./UnifiedView";

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
    if (!diffResult) return null;

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-[96vw] w-[96vw] sm:max-w-[96vw] h-[92vh] flex flex-col p-0 gap-0 bg-neutral-950 border-neutral-800 text-neutral-200 dark !max-w-[96vw]">
                <DialogHeader className="p-4 border-b border-neutral-800 shrink-0">
                    <DialogTitle className="sr-only">Text Comparison</DialogTitle>
                    <div className="flex items-center justify-between px-4">
                        <div className="flex items-center gap-6">
                            <div className="flex items-center gap-3">
                                <Switch
                                    id="unified-mode"
                                    checked={isUnified}
                                    onCheckedChange={setIsUnified}
                                    className="data-[state=checked]:bg-blue-600"
                                />
                                <Label htmlFor="unified-mode" className="text-neutral-300 font-medium select-none cursor-pointer">Unified View</Label>
                            </div>

                            <div className="h-4 w-px bg-neutral-800" />

                            <Tabs value={diffType} onValueChange={(v) => setDiffType(v as DiffType)}>
                                <TabsList className="bg-neutral-900 border border-neutral-800 h-8">
                                    <TabsTrigger value="chars" className="text-xs data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-100 text-neutral-400 px-3 h-6">Char</TabsTrigger>
                                    <TabsTrigger value="words" className="text-xs data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-100 text-neutral-400 px-3 h-6">Word</TabsTrigger>
                                    <TabsTrigger value="lines" className="text-xs data-[state=active]:bg-neutral-800 data-[state=active]:text-neutral-100 text-neutral-400 px-3 h-6">Line</TabsTrigger>
                                </TabsList>
                            </Tabs>
                        </div>
                    </div>
                </DialogHeader>

                <div className="flex-1 min-h-0 bg-black/40 overflow-hidden">
                    {isUnified ? (
                        <UnifiedView diffResult={diffResult} />
                    ) : (
                        <SplitView diffResult={diffResult} />
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
