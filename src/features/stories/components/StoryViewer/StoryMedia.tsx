import { useState, type TransitionEvent } from "react";
import { Spinner } from "../../../../shared/components/Spinner";
import type { StoryItem } from "../../types";
import { useStoryViewerContext } from "./StoryViewerContext";
import styles from "./StoryViewer.module.css";

type Frames = {
  incoming: StoryItem;
  outgoing: StoryItem | null;
};

/**
 * Cross-fades between stories.
 *
 * The outgoing image stays painted underneath until the incoming one has
 * decoded and finished fading in, so navigation never flashes black — which is
 * also why the loading spinner appears over real content rather than a void.
 */
export function StoryMedia() {
  const { story, imageStatus, direction } = useStoryViewerContext();
  const [frames, setFrames] = useState<Frames>({ incoming: story.item, outgoing: null });

  // Adjusting state during render (React's documented pattern) rather than in an
  // effect: the new frame is staged in the same commit, avoiding a blank paint.
  if (frames.incoming.id !== story.item.id) {
    setFrames({ incoming: story.item, outgoing: frames.incoming });
  }

  const isIncomingVisible = imageStatus === "loaded";

  const handleTransitionEnd = (event: TransitionEvent<HTMLDivElement>): void => {
    if (event.propertyName === "opacity" && isIncomingVisible && frames.outgoing !== null) {
      setFrames({ incoming: frames.incoming, outgoing: null });
    }
  };

  const { caption } = frames.incoming;
  const incomingAlt =
    caption === undefined ? `Story by ${story.user.username}` : caption;

  return (
    <div className={styles.stage}>
      {frames.outgoing !== null && (
        <div key={frames.outgoing.id} className={styles.frame} data-role="outgoing" data-visible>
          <img className={styles.image} src={frames.outgoing.imageUrl} alt="" draggable={false} />
        </div>
      )}

      <div
        key={frames.incoming.id}
        className={styles.frame}
        data-role="incoming"
        data-direction={direction}
        data-visible={isIncomingVisible}
        onTransitionEnd={handleTransitionEnd}
      >
        <img
          className={styles.image}
          src={frames.incoming.imageUrl}
          alt={incomingAlt}
          draggable={false}
        />
      </div>

      {imageStatus === "loading" && (
        <div className={styles.mediaStatus}>
          <Spinner label="Loading story" />
        </div>
      )}

      {imageStatus === "error" && (
        <div className={styles.mediaStatus}>
          <p className={styles.mediaError} role="status">
            This story could not be loaded.
            <br />
            Moving on in a moment.
          </p>
        </div>
      )}
    </div>
  );
}
