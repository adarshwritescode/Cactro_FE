import { useLayoutEffect } from "react";

/**
 * Freezes background scrolling for as long as the calling component is mounted,
 * restoring whatever `overflow` value the document already had rather than
 * assuming `visible`.
 */
export function useBodyScrollLock(): void {
  useLayoutEffect(() => {
    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = "hidden";

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, []);
}
