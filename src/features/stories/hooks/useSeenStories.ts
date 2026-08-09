import { useCallback, useState } from "react";

type SeenStories = {
  seenUserIds: ReadonlySet<string>;
  markSeen: (userId: string) => void;
};

/**
 * Remembers which reels have been opened this session so their tray ring can go
 * grey. Session-only by design — persistence is out of scope for this exercise.
 */
export function useSeenStories(): SeenStories {
  const [seenUserIds, setSeenUserIds] = useState<ReadonlySet<string>>(() => new Set());

  const markSeen = useCallback((userId: string) => {
    setSeenUserIds((previous) => {
      if (previous.has(userId)) {
        return previous;
      }
      const next = new Set(previous);
      next.add(userId);
      return next;
    });
  }, []);

  return { seenUserIds, markSeen };
}
