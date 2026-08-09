import { useEffect, useMemo, useRef } from "react";

/**
 * Read-only view of the running story's progress, from 0 to 1.
 *
 * Progress is published through a subscription rather than component state so
 * that a 60fps animation re-renders only the progress bar, never the image or
 * the rest of the viewer.
 */
export type ProgressStore = {
  subscribe: (listener: () => void) => () => void;
  getSnapshot: () => number;
};

type MutableProgressStore = ProgressStore & {
  publish: (value: number) => void;
};

function createProgressStore(): MutableProgressStore {
  const listeners = new Set<() => void>();
  let progress = 0;

  return {
    subscribe(listener) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
    getSnapshot() {
      return progress;
    },
    publish(value) {
      progress = value;
      for (const listener of listeners) {
        listener();
      }
    },
  };
}

type UseStoryTimerOptions = {
  durationMs: number;
  /** While true the clock holds — used for image loading and long-press. */
  paused: boolean;
  /** Any change restarts the countdown from zero. */
  resetKey: string;
  onComplete: () => void;
};

/**
 * Drives the 5-second auto-advance.
 *
 * Uses `requestAnimationFrame` rather than `setInterval`: it produces the smooth
 * value the progress bar renders from, it self-throttles when the tab is
 * backgrounded, and accumulated elapsed time makes pause/resume exact.
 */
export function useStoryTimer({
  durationMs,
  paused,
  resetKey,
  onComplete,
}: UseStoryTimerOptions): ProgressStore {
  const store = useMemo(() => createProgressStore(), []);
  const elapsedRef = useRef(0);

  // Declared before the ticking effect so it runs first on a reset commit.
  useEffect(() => {
    elapsedRef.current = 0;
    store.publish(0);
  }, [resetKey, store]);

  useEffect(() => {
    if (paused) {
      return;
    }

    let frameId = 0;
    let previousTimestamp: number | null = null;

    const tick = (timestamp: number): void => {
      if (previousTimestamp === null) {
        previousTimestamp = timestamp;
      }
      elapsedRef.current += timestamp - previousTimestamp;
      previousTimestamp = timestamp;

      const value = Math.min(elapsedRef.current / durationMs, 1);
      store.publish(value);

      if (value >= 1) {
        onComplete();
        return;
      }
      frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(frameId);
    };
    // Elapsed time lives in a ref, so re-running this effect resumes the
    // countdown where it left off rather than restarting it.
  }, [paused, durationMs, resetKey, store, onComplete]);

  return store;
}
