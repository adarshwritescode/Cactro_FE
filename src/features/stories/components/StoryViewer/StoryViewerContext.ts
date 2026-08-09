import { createContext, useContext } from "react";
import type { NavigationDirection } from "../../state/storyViewerReducer";
import type { ResolvedStory } from "../../types";
import type { ImageStatus } from "../../hooks/useImageStatus";
import type { ProgressStore } from "../../hooks/useStoryTimer";

export type StoryViewerContextValue = {
  story: ResolvedStory;
  direction: NavigationDirection;
  imageStatus: ImageStatus;
  progress: ProgressStore;
  /** True while the user is holding the screen — chrome fades out. */
  isHeld: boolean;
  goToNext: () => void;
  goToPrevious: () => void;
  close: () => void;
  beginHold: () => void;
  endHold: () => void;
};

const StoryViewerContext = createContext<StoryViewerContextValue | null>(null);

export const StoryViewerProvider = StoryViewerContext.Provider;

/**
 * Explicit null check rather than a non-null assertion: misuse fails with a
 * readable message, and the return type is genuinely non-nullable.
 */
export function useStoryViewerContext(): StoryViewerContextValue {
  const value = useContext(StoryViewerContext);

  if (value === null) {
    throw new Error("StoryViewer subcomponents must be rendered inside <StoryViewer>.");
  }

  return value;
}
