import { useEffect, useRef } from "react";

/**
 * Moves focus to the first card heading inside the returned ref's element when
 * the step (key) changes, so keyboard and screen reader users land on the new
 * content. Keys in `ignore` are transient (loading) and never change focus, and
 * the first real step the page shows is not focused, so nothing is stolen on load.
 */
export function useFocusHeading(key: string, ignore: readonly string[]) {
  const ref = useRef<HTMLDivElement>(null);
  const previous = useRef<string | null>(null);
  useEffect(() => {
    if (ignore.includes(key) || previous.current === key) return;
    const first = previous.current === null;
    previous.current = key;
    if (first) return;
    ref.current?.querySelector<HTMLElement>("h2")?.focus();
  }, [key, ignore]);
  return ref;
}
