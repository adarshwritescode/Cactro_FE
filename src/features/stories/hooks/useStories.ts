import { useCallback, useEffect, useState } from "react";
import { type AsyncState, toError } from "../../../shared/types/asyncState";
import { fetchStories } from "../api/storiesSource";
import type { StoryUser } from "../types";

type StoriesState = {
  /** Bumped by `retry`; also the effect's dependency and the staleness guard. */
  attempt: number;
  value: AsyncState<StoryUser[]>;
};

type UseStoriesResult = {
  state: AsyncState<StoryUser[]>;
  /** Re-runs the request; wired to the error state's retry button. */
  retry: () => void;
};

export function useStories(): UseStoriesResult {
  const [state, setState] = useState<StoriesState>({
    attempt: 0,
    value: { status: "loading" },
  });

  const { attempt } = state;

  useEffect(() => {
    const controller = new AbortController();

    // Every write is funnelled through an updater that ignores results from a
    // superseded attempt, so an in-flight response can never clobber a retry.
    const applyIfCurrent = (value: AsyncState<StoryUser[]>): void => {
      setState((previous) => (previous.attempt === attempt ? { attempt, value } : previous));
    };

    fetchStories(controller.signal)
      .then((data) => {
        applyIfCurrent({ status: "success", data });
      })
      .catch((cause: unknown) => {
        // An abort is teardown, not a failure — leave the state alone.
        if (controller.signal.aborted) {
          return;
        }
        applyIfCurrent({ status: "error", error: toError(cause) });
      });

    return () => {
      controller.abort();
    };
  }, [attempt]);

  const retry = useCallback(() => {
    setState((previous) => ({ attempt: previous.attempt + 1, value: { status: "loading" } }));
  }, []);

  return { state: state.value, retry };
}
