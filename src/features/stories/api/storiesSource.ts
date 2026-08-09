import type { StoryItem, StoryUser } from "../types";

const STORIES_ENDPOINT = "/data/stories.json";

/**
 * `response.json()` hands back `unknown`. These predicates are the single
 * boundary where untyped data becomes typed data — by narrowing, never by
 * asserting, so a malformed payload fails loudly instead of corrupting state.
 */
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function isNonEmptyString(value: unknown): value is string {
  return typeof value === "string" && value.length > 0;
}

function isOptionalString(value: unknown): value is string | undefined {
  return value === undefined || typeof value === "string";
}

function isStoryItem(value: unknown): value is StoryItem {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.imageUrl) &&
    isNonEmptyString(value.publishedAt) &&
    isOptionalString(value.caption)
  );
}

function isStoryUser(value: unknown): value is StoryUser {
  return (
    isRecord(value) &&
    isNonEmptyString(value.id) &&
    isNonEmptyString(value.username) &&
    isNonEmptyString(value.avatarUrl) &&
    Array.isArray(value.items) &&
    value.items.length > 0 &&
    value.items.every(isStoryItem)
  );
}

function isStoryUserArray(value: unknown): value is StoryUser[] {
  return Array.isArray(value) && value.every(isStoryUser);
}

/**
 * Loads the story reels from the external data file.
 *
 * @param signal aborts the request when the caller unmounts.
 * @throws {Error} on a non-OK response or a payload that fails validation.
 */
export async function fetchStories(signal: AbortSignal): Promise<StoryUser[]> {
  let response: Response;

  try {
    response = await fetch(STORIES_ENDPOINT, { signal });
  } catch (cause) {
    // A transport failure surfaces as a bare "Failed to fetch"; the abort path
    // is re-thrown untouched so the caller can still recognise its own teardown.
    if (signal.aborted) {
      throw cause;
    }
    throw new Error("We couldn’t reach the server. Check your connection and try again.", {
      cause,
    });
  }

  if (!response.ok) {
    throw new Error(`Could not load stories (HTTP ${response.status}).`);
  }

  const payload: unknown = await response.json();

  if (!isStoryUserArray(payload)) {
    throw new Error("Stories data is malformed and could not be displayed.");
  }

  if (payload.length === 0) {
    throw new Error("There are no stories to show right now.");
  }

  return payload;
}
