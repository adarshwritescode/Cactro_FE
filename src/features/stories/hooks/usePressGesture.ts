import { useRef } from "react";

/** A press longer than this counts as a hold, not a tap. */
const TAP_THRESHOLD_MS = 250;

type PressGestureOptions = {
  onHoldStart: () => void;
  onHoldEnd: () => void;
  onTap: () => void;
};

type PressGestureHandlers = {
  onPointerDown: () => void;
  onPointerUp: () => void;
  onPointerCancel: () => void;
  onPointerLeave: () => void;
};

/**
 * Distinguishes a tap from a press-and-hold on the same surface.
 *
 * Pausing begins the instant the finger lands — matching Instagram — and the
 * navigation only fires if the finger lifts quickly enough to be a tap.
 */
export function usePressGesture({
  onHoldStart,
  onHoldEnd,
  onTap,
}: PressGestureOptions): PressGestureHandlers {
  const pressStartedAtRef = useRef<number | null>(null);

  const release = (allowTap: boolean): void => {
    const startedAt = pressStartedAtRef.current;
    if (startedAt === null) {
      return;
    }
    pressStartedAtRef.current = null;
    onHoldEnd();

    if (allowTap && performance.now() - startedAt < TAP_THRESHOLD_MS) {
      onTap();
    }
  };

  // Plain object: these go straight onto DOM elements, which do not care about
  // handler identity the way a memoised child component would.
  return {
    onPointerDown: () => {
      pressStartedAtRef.current = performance.now();
      onHoldStart();
    },
    onPointerUp: () => release(true),
    onPointerCancel: () => release(false),
    onPointerLeave: () => release(false),
  };
}
