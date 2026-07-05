import { useState, useCallback, useMemo } from 'react';
import * as Diff from 'diff';

export type DiffType = 'chars' | 'words' | 'lines';

export type DiffResult = {
    original: string;
    modified: string;
    diffs: Diff.Change[];
};

export function useCompare() {
    const [original, setOriginal] = useState('');
    const [modified, setModified] = useState('');
    const [diffType, setDiffType] = useState<DiffType>('chars');
    // Texts captured when Compare was clicked; the diff itself is derived,
    // so switching diff type recomputes automatically.
    const [snapshot, setSnapshot] = useState<{ original: string; modified: string } | null>(null);

    const compare = useCallback(() => {
        setSnapshot({ original, modified });
    }, [original, modified]);

    const diffResult = useMemo<DiffResult | null>(() => {
        if (!snapshot) return null;

        let diffs: Diff.Change[];
        switch (diffType) {
            case 'chars':
                diffs = Diff.diffChars(snapshot.original, snapshot.modified);
                break;
            case 'words':
                diffs = Diff.diffWords(snapshot.original, snapshot.modified);
                break;
            case 'lines':
                diffs = Diff.diffLines(snapshot.original, snapshot.modified);
                break;
        }

        return { ...snapshot, diffs };
    }, [snapshot, diffType]);

    return {
        original,
        setOriginal,
        modified,
        setModified,
        diffType,
        setDiffType,
        diffResult,
        compare,
    };
}
