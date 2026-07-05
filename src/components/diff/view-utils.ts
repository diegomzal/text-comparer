// Styling and scroll helpers shared by SplitView and UnifiedView so the two
// renderings can't drift apart.

export const addedClass =
    "bg-green-100 text-green-800 dark:bg-green-900/70 dark:text-green-100";

export const removedClass =
    "bg-red-100 text-red-800 line-through decoration-red-500 decoration-2 dark:bg-red-900/70 dark:text-red-100";

export const activeChangeClass =
    "outline-2 outline-offset-1 outline-blue-500";

/**
 * Navigation target. A fresh object is created per navigation click so the
 * views' scroll effects re-fire even when the index is unchanged (e.g. a
 * single-difference diff, or re-centering after the user scrolled away).
 */
export type ActiveChange = { index: number } | null;

/** Center the span for a change group within a scroll viewport. */
export function centerChange(viewport: HTMLElement | null, changeIndex: number) {
    if (!viewport) return;
    const el = viewport.querySelector<HTMLElement>(`[data-change="${changeIndex}"]`);
    if (!el) return;
    const top =
        el.getBoundingClientRect().top -
        viewport.getBoundingClientRect().top +
        viewport.scrollTop;
    viewport.scrollTop = Math.max(0, top - viewport.clientHeight / 2);
}
