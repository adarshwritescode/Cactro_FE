import { useCallback, useMemo, useSyncExternalStore } from "react";

/**
 * Subscribes to a CSS media query.
 *
 * Built on `useSyncExternalStore` rather than the usual `useState` + `useEffect`
 * pair: `matchMedia` is an external mutable source, and this is the primitive
 * React provides for reading one without tearing on concurrent renders.
 */
export function useMediaQuery(query: string): boolean {
  const mediaQueryList = useMemo(() => window.matchMedia(query), [query]);

  const subscribe = useCallback(
    (onStoreChange: () => void) => {
      mediaQueryList.addEventListener("change", onStoreChange);
      return () => mediaQueryList.removeEventListener("change", onStoreChange);
    },
    [mediaQueryList],
  );

  const getSnapshot = useCallback(() => mediaQueryList.matches, [mediaQueryList]);

  return useSyncExternalStore(subscribe, getSnapshot);
}
