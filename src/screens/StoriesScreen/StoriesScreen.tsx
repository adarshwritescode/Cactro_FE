import { useEffect } from "react";
import { StoryTray, StoryTraySkeleton } from "../../features/stories/components/StoryTray/StoryTray";
import { StoryViewer } from "../../features/stories/components/StoryViewer/StoryViewer";
import { useSeenStories } from "../../features/stories/hooks/useSeenStories";
import { useStories } from "../../features/stories/hooks/useStories";
import { useStoryViewer } from "../../features/stories/hooks/useStoryViewer";
import type { StoryUser } from "../../features/stories/types";
import styles from "./StoriesScreen.module.css";

function TopBar({ subtitle }: { subtitle: string }) {
  return (
    <header className={styles.topBar}>
      <h1 className={`${styles.wordmark} gradient-text`}>Stories</h1>
      <span className={styles.count}>{subtitle}</span>
    </header>
  );
}

/**
 * Deliberately unattributed — these are written for the app, and putting a real
 * person's name under an invented line would be a fabricated quote.
 */
const QUOTES = [
  "A story is just a day someone decided not to keep to themselves.",
  "The best part of sharing was never the audience. It is the one friend who replies at midnight.",
  "Distance used to mean missing things. Now it only means watching from further away.",
] as const;

/**
 * Fills the space under the tray, which would otherwise read as a half-drawn
 * screen once you have caught up on everyone's reels.
 */
function Quotes() {
  return (
    <section className={styles.quotes} aria-label="On sharing">
      {QUOTES.map((quote) => (
        <blockquote key={quote}>
          <p>{quote}</p>
        </blockquote>
      ))}
    </section>
  );
}

/**
 * The happy path, split out so the hooks below never run conditionally: this
 * component only ever exists once the stories have actually loaded.
 */
function StoriesContent({ stories }: { stories: StoryUser[] }) {
  const { current, direction, upcomingImageUrl, open, next, previous, close } =
    useStoryViewer(stories);
  const { seenUserIds, markSeen } = useSeenStories();

  const currentUserId = current === null ? null : current.user.id;

  useEffect(() => {
    if (currentUserId !== null) {
      markSeen(currentUserId);
    }
  }, [currentUserId, markSeen]);

  const totalItems = stories.reduce((sum, user) => sum + user.items.length, 0);

  return (
    <div className={styles.screen}>
      <TopBar subtitle={`${stories.length} people · ${totalItems} stories`} />
      <StoryTray users={stories} seenUserIds={seenUserIds} onSelectUser={open} />
      <Quotes />

      {current !== null && (
        <StoryViewer
          story={current}
          direction={direction}
          upcomingImageUrl={upcomingImageUrl}
          onNext={next}
          onPrevious={previous}
          onClose={close}
        >
          <StoryViewer.Media />
          <StoryViewer.Caption />
          <StoryViewer.Chrome>
            <StoryViewer.Progress />
            <StoryViewer.Header />
          </StoryViewer.Chrome>
          <StoryViewer.TapZones />
        </StoryViewer>
      )}
    </div>
  );
}

export function StoriesScreen() {
  const { state, retry } = useStories();

  switch (state.status) {
    case "loading":
      return (
        <div className={styles.screen}>
          <TopBar subtitle="Loading…" />
          <StoryTraySkeleton />
        </div>
      );

    case "error":
      return (
        <div className="message" role="alert">
          <p className="message-title">We couldn’t load the stories</p>
          <p className="message-body">{state.error.message}</p>
          <button type="button" className="pill" onClick={retry}>
            Try again
          </button>
        </div>
      );

    case "success":
      return <StoriesContent stories={state.data} />;
  }
}
