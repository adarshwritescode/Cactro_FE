import { useCallback, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { useBodyScrollLock } from "../../../../shared/hooks/useBodyScrollLock";
import { STORY_DURATION_MS } from "../../constants";
import { useImagePreloader } from "../../hooks/useImagePreloader";
import { useImageStatus } from "../../hooks/useImageStatus";
import { useStoryKeyboard } from "../../hooks/useStoryKeyboard";
import { useStoryTimer } from "../../hooks/useStoryTimer";
import type { NavigationDirection } from "../../state/storyViewerReducer";
import type { ResolvedStory } from "../../types";
import { StoryCaption } from "./StoryCaption";
import { StoryHeader } from "./StoryHeader";
import { StoryMedia } from "./StoryMedia";
import { StoryProgress } from "./StoryProgress";
import { StoryTapZones } from "./StoryTapZones";
import {
  StoryViewerProvider,
  useStoryViewerContext,
  type StoryViewerContextValue,
} from "./StoryViewerContext";
import styles from "./StoryViewer.module.css";

type StoryViewerProps = {
  story: ResolvedStory;
  direction: NavigationDirection;
  /** Warmed in the background so the next tap is instant. */
  upcomingImageUrl: string | null;
  onNext: () => void;
  onPrevious: () => void;
  onClose: () => void;
  children: ReactNode;
};

/** Groups the progress bars and header so both fade out together on hold. */
function StoryChrome({ children }: { children: ReactNode }) {
  const { isHeld } = useStoryViewerContext();
  return (
    <div className={styles.chrome} data-held={isHeld}>
      {children}
    </div>
  );
}

/**
 * The full-screen story experience.
 *
 * Owns exactly one job — orchestration. It runs the countdown, tracks image
 * loading and hold-to-pause, then publishes that through context so each
 * subcomponent stays presentational and independently composable.
 */
export function StoryViewer({
  story,
  direction,
  upcomingImageUrl,
  onNext,
  onPrevious,
  onClose,
  children,
}: StoryViewerProps) {
  const overlayRef = useRef<HTMLDivElement | null>(null);
  const [isHeld, setIsHeld] = useState(false);

  const imageStatus = useImageStatus(story.item.imageUrl);
  useImagePreloader(upcomingImageUrl);
  useBodyScrollLock();

  const beginHold = useCallback(() => {
    setIsHeld(true);
  }, []);

  const endHold = useCallback(() => {
    setIsHeld(false);
  }, []);

  // A story that is still downloading must not spend its five seconds; a broken
  // one is allowed to time out so the reel is never stuck.
  const progress = useStoryTimer({
    durationMs: STORY_DURATION_MS,
    paused: isHeld || imageStatus === "loading",
    resetKey: story.item.id,
    onComplete: onNext,
  });

  useStoryKeyboard({ onNext, onPrevious, onClose });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const overlay = overlayRef.current;

    if (overlay !== null) {
      overlay.focus();
    }

    return () => {
      if (previouslyFocused instanceof HTMLElement) {
        previouslyFocused.focus();
      }
    };
  }, []);

  const contextValue = useMemo<StoryViewerContextValue>(
    () => ({
      story,
      direction,
      imageStatus,
      progress,
      isHeld,
      goToNext: onNext,
      goToPrevious: onPrevious,
      close: onClose,
      beginHold,
      endHold,
    }),
    [story, direction, imageStatus, progress, isHeld, onNext, onPrevious, onClose, beginHold, endHold],
  );

  return createPortal(
    <div
      ref={overlayRef}
      className={styles.overlay}
      role="dialog"
      aria-modal="true"
      aria-label={`Stories from ${story.user.username}`}
      tabIndex={-1}
    >
      <StoryViewerProvider value={contextValue}>{children}</StoryViewerProvider>
    </div>,
    document.body,
  );
}

StoryViewer.Chrome = StoryChrome;
StoryViewer.Progress = StoryProgress;
StoryViewer.Header = StoryHeader;
StoryViewer.Media = StoryMedia;
StoryViewer.Caption = StoryCaption;
StoryViewer.TapZones = StoryTapZones;
