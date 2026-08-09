import { useCallback, useReducer } from "react";
import {
  INITIAL_STORY_VIEWER_STATE,
  type NavigationDirection,
  selectNextImageUrl,
  selectStory,
  type StoryViewerAction,
  type StoryViewerState,
  storyViewerReducer,
} from "../state/storyViewerReducer";
import type { ResolvedStory, StoryUser } from "../types";

export type StoryViewerController = {
  /** `null` whenever the viewer is closed. */
  current: ResolvedStory | null;
  direction: NavigationDirection;
  /** Image to warm up next, if any. */
  upcomingImageUrl: string | null;
  open: (userIndex: number) => void;
  next: () => void;
  previous: () => void;
  close: () => void;
};

/**
 * Binds the pure navigation reducer to the loaded stories and exposes an
 * intention-shaped API. Components call `next()`; none of them know that a
 * reel boundary or the end of the collection is involved.
 */
export function useStoryViewer(stories: StoryUser[]): StoryViewerController {
  const [state, dispatch] = useReducer(
    (current: StoryViewerState, action: StoryViewerAction) =>
      storyViewerReducer(stories, current, action),
    INITIAL_STORY_VIEWER_STATE,
  );

  const open = useCallback((userIndex: number) => {
    dispatch({ type: "open", userIndex });
  }, []);

  const next = useCallback(() => {
    dispatch({ type: "next" });
  }, []);

  const previous = useCallback(() => {
    dispatch({ type: "previous" });
  }, []);

  const close = useCallback(() => {
    dispatch({ type: "close" });
  }, []);

  // Derived, never stored: a cursor that no longer resolves simply reads closed.
  const current = selectStory(stories, state.cursor);
  const upcomingImageUrl = selectNextImageUrl(stories, state.cursor);

  return {
    current,
    direction: state.direction,
    upcomingImageUrl,
    open,
    next,
    previous,
    close,
  };
}
