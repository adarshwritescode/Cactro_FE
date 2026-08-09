import type { ResolvedStory, StoryCursor, StoryUser } from "../types";

export type NavigationDirection = "forward" | "backward";

export type StoryViewerState = {
  /** `null` means the viewer is closed. */
  cursor: StoryCursor | null;
  /** Drives which way the media transition animates. */
  direction: NavigationDirection;
};

export type StoryViewerAction =
  | { type: "open"; userIndex: number }
  | { type: "next" }
  | { type: "previous" }
  | { type: "close" };

export const INITIAL_STORY_VIEWER_STATE: StoryViewerState = {
  cursor: null,
  direction: "forward",
};

const CLOSED_FORWARD: StoryViewerState = { cursor: null, direction: "forward" };

/**
 * Resolves a cursor against the data it points into.
 *
 * Returns `null` for any out-of-range cursor, which is how every consumer gets
 * a fully-typed `{ user, item }` without an index assertion.
 */
export function selectStory(
  stories: StoryUser[],
  cursor: StoryCursor | null,
): ResolvedStory | null {
  if (cursor === null) {
    return null;
  }

  const user = stories.at(cursor.userIndex);
  if (user === undefined) {
    return null;
  }

  const item = user.items.at(cursor.itemIndex);
  if (item === undefined) {
    return null;
  }

  return { user, item, cursor };
}

/** The image the viewer should warm up next, if there is one. */
export function selectNextImageUrl(
  stories: StoryUser[],
  cursor: StoryCursor | null,
): string | null {
  if (cursor === null) {
    return null;
  }

  const nextCursor = advance(stories, cursor);
  const next = selectStory(stories, nextCursor);
  return next === null ? null : next.item.imageUrl;
}

/** Next cursor in reading order, or `null` when the whole reel is exhausted. */
function advance(stories: StoryUser[], cursor: StoryCursor): StoryCursor | null {
  const user = stories.at(cursor.userIndex);
  if (user === undefined) {
    return null;
  }

  if (cursor.itemIndex + 1 < user.items.length) {
    return { userIndex: cursor.userIndex, itemIndex: cursor.itemIndex + 1 };
  }

  if (cursor.userIndex + 1 < stories.length) {
    return { userIndex: cursor.userIndex + 1, itemIndex: 0 };
  }

  return null;
}

/**
 * Previous cursor. Stepping back past a user's first item lands on the previous
 * user's first item — matching Instagram — and the very first story stays put.
 */
function rewind(cursor: StoryCursor): StoryCursor {
  if (cursor.itemIndex > 0) {
    return { userIndex: cursor.userIndex, itemIndex: cursor.itemIndex - 1 };
  }

  if (cursor.userIndex > 0) {
    return { userIndex: cursor.userIndex - 1, itemIndex: 0 };
  }

  return cursor;
}

/**
 * All navigation rules live here: a pure function of (data, state, action),
 * unit-testable without React and leaving components free of branching logic.
 */
export function storyViewerReducer(
  stories: StoryUser[],
  state: StoryViewerState,
  action: StoryViewerAction,
): StoryViewerState {
  switch (action.type) {
    case "open": {
      const user = stories.at(action.userIndex);
      if (user === undefined) {
        return state;
      }
      return {
        cursor: { userIndex: action.userIndex, itemIndex: 0 },
        direction: "forward",
      };
    }

    case "next": {
      if (state.cursor === null) {
        return state;
      }
      const nextCursor = advance(stories, state.cursor);
      if (nextCursor === null) {
        // Past the last story of the last user: close, like the real app.
        return CLOSED_FORWARD;
      }
      return { cursor: nextCursor, direction: "forward" };
    }

    case "previous": {
      if (state.cursor === null) {
        return state;
      }
      const previousCursor = rewind(state.cursor);
      if (
        previousCursor.userIndex === state.cursor.userIndex &&
        previousCursor.itemIndex === state.cursor.itemIndex
      ) {
        // Already at the very first story — keep identity so React skips a render.
        return state;
      }
      return { cursor: previousCursor, direction: "backward" };
    }

    case "close":
      return state.cursor === null ? state : CLOSED_FORWARD;
  }
}
