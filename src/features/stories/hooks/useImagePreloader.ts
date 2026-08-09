import { useEffect } from "react";

/**
 * Warms the browser cache for the story after this one, so tapping forward
 * lands on an image that is already decoded instead of a spinner.
 */
export function useImagePreloader(source: string | null): void {
  useEffect(() => {
    if (source === null) {
      return;
    }

    const image = new Image();
    image.src = source;

    return () => {
      // Releases the request if the user moves on before it finishes.
      image.src = "";
    };
  }, [source]);
}
