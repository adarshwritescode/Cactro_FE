import { useEffect, useState } from "react";

export type ImageStatus = "loading" | "loaded" | "error";

type ImageState = {
  /** The source this status describes, so a stale result is never applied. */
  source: string;
  status: ImageStatus;
};

/**
 * Tracks a single image's load state off-DOM.
 *
 * The viewer holds its countdown until this reports `loaded`, so a slow image
 * never silently burns its five seconds.
 */
export function useImageStatus(source: string): ImageStatus {
  const [state, setState] = useState<ImageState>(() => ({ source, status: "loading" }));

  // Reset during render rather than in an effect: the caller sees `loading` for
  // the new source in the same pass, with no interim frame of stale status.
  if (state.source !== source) {
    setState({ source, status: "loading" });
  }

  useEffect(() => {
    const image = new Image();
    let cancelled = false;

    image.src = source;

    // `decode()` resolves only once the bitmap is ready to paint — stronger than
    // `load`, and always asynchronous, so state never changes mid-effect.
    image
      .decode()
      .then(() => {
        if (!cancelled) {
          setState({ source, status: "loaded" });
        }
      })
      .catch(() => {
        if (!cancelled) {
          setState({ source, status: "error" });
        }
      });

    return () => {
      cancelled = true;
    };
  }, [source]);

  return state.source === source ? state.status : "loading";
}
