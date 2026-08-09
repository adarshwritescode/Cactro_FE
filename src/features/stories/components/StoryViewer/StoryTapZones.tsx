import { usePressGesture } from "../../hooks/usePressGesture";
import { useStoryViewerContext } from "./StoryViewerContext";
import styles from "./StoryViewer.module.css";

/**
 * The two invisible halves of the screen.
 *
 * Real `<button>` elements rather than a div with an onClick: the viewer stays
 * operable by keyboard and announces itself to assistive technology.
 */
export function StoryTapZones() {
  const { goToNext, goToPrevious, beginHold, endHold, isHeld } = useStoryViewerContext();

  const previousGesture = usePressGesture({
    onHoldStart: beginHold,
    onHoldEnd: endHold,
    onTap: goToPrevious,
  });

  const nextGesture = usePressGesture({
    onHoldStart: beginHold,
    onHoldEnd: endHold,
    onTap: goToNext,
  });

  return (
    <>
      <div className={styles.tapZones}>
        <button
          type="button"
          className={styles.tapZone}
          aria-label="Previous story"
          {...previousGesture}
        />
        <button type="button" className={styles.tapZone} aria-label="Next story" {...nextGesture} />
      </div>

      {isHeld && <div className={styles.pausedBadge}>Paused</div>}
    </>
  );
}
