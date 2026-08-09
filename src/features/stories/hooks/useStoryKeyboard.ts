import { useEffect } from "react";

type StoryKeyboardHandlers = {
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
};

/**
 * Keyboard parity for the tap zones — the viewer is otherwise unreachable
 * without a touchscreen, and reviewers do open it on a resized desktop window.
 */
export function useStoryKeyboard({ onNext, onPrevious, onClose }: StoryKeyboardHandlers): void {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent): void => {
      switch (event.key) {
        case "ArrowRight":
          event.preventDefault();
          onNext();
          break;
        case "ArrowLeft":
          event.preventDefault();
          onPrevious();
          break;
        case "Escape":
          event.preventDefault();
          onClose();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onNext, onPrevious, onClose]);
}
