import { useSyncExternalStore } from "react";
import { useStoryViewerContext } from "./StoryViewerContext";
import styles from "./StoryViewer.module.css";

/**
 * One segment per story in the current user's reel.
 *
 * Subscribing to the progress store here — rather than lifting the value into
 * the viewer's state — keeps the 60fps update inside this component.
 */
export function StoryProgress() {
  const { story, progress } = useStoryViewerContext();
  const value = useSyncExternalStore(progress.subscribe, progress.getSnapshot);

  const { user, cursor } = story;

  return (
    <div
      className={styles.progressRow}
      role="group"
      aria-label={`Story ${cursor.itemIndex + 1} of ${user.items.length}`}
    >
      {user.items.map((item, index) => {
        const fill = index < cursor.itemIndex ? 1 : index === cursor.itemIndex ? value : 0;

        return (
          <div key={item.id} className={styles.track}>
            <div className={styles.fill} style={{ transform: `scaleX(${fill})` }} />
          </div>
        );
      })}
    </div>
  );
}
