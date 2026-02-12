import { useState, useCallback, useEffect } from 'react';
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
    const [diffResult, setDiffResult] = useState<DiffResult | null>(null);

    const compare = useCallback(() => {
        let diffs: Diff.Change[] = [];

        switch (diffType) {
            case 'chars':
                diffs = Diff.diffChars(original, modified);
                break;
            case 'words':
                diffs = Diff.diffWords(original, modified);
                break;
            case 'lines':
                diffs = Diff.diffLines(original, modified);
                break;
        }

        setDiffResult({
            original,
            modified,
            diffs,
        });
    }, [original, modified, diffType]);

    useEffect(() => {
        if (diffResult) {
            compare();
        }
    }, [diffType]); // eslint-disable-line react-hooks/exhaustive-deps

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
