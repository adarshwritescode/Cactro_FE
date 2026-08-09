/** A single image within a user's story reel. */
export type StoryItem = {
  id: string;
  imageUrl: string;
  caption?: string;
  /** ISO-8601 timestamp used for the "2h ago" label. */
  publishedAt: string;
};

/** One avatar in the tray: an author plus the reel they published. */
export type StoryUser = {
  id: string;
  username: string;
  avatarUrl: string;
  items: StoryItem[];
};

/** Points at exactly one story item within the whole collection. */
export type StoryCursor = {
  userIndex: number;
  itemIndex: number;
};

/** A cursor resolved against the data it points into. */
export type ResolvedStory = {
  user: StoryUser;
  item: StoryItem;
  cursor: StoryCursor;
};
