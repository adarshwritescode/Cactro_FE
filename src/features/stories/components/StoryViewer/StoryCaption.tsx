import { useStoryViewerContext } from "./StoryViewerContext";
import styles from "./StoryViewer.module.css";

export function StoryCaption() {
  const { story, isHeld } = useStoryViewerContext();
  const { caption } = story.item;

  if (caption === undefined) {
    return null;
  }

  return (
    <p className={styles.caption} data-held={isHeld}>
      {caption}
    </p>
  );
}
