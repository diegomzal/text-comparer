import type * as Diff from 'diff';

export type DiffStats = {
    /** Number of change groups (adjacent removed+added parts count as one). */
    changeCount: number;
    /** Number of added parts. */
    added: number;
    /** Number of removed parts. */
    removed: number;
    /** Maps a part's index in `diffs` to its change group index. */
    partToChange: Map<number, number>;
};

export function getDiffStats(diffs: Diff.Change[]): DiffStats {
    const partToChange = new Map<number, number>();
    let changeCount = 0;
    let added = 0;
    let removed = 0;
    let prevChanged = false;

    diffs.forEach((part, i) => {
        const changed = Boolean(part.added || part.removed);
        if (changed) {
            if (part.added) added++;
            if (part.removed) removed++;
            if (!prevChanged) changeCount++;
            partToChange.set(i, changeCount - 1);
        }
        prevChanged = changed;
    });

    return { changeCount, added, removed, partToChange };
}
