import styles from "./DesktopNotice.module.css";

export function DesktopNotice() {
  return (
    <main className={styles.screen}>
      <div className={styles.content}>
        <h1 className={styles.title}>
          Stories live on <span className="gradient-text">the small screen</span>
        </h1>
        <p className={styles.body}>
          This one is built for thumbs — tap the left or right of a story to move through it, hold
          to pause. Open it on your phone to get the real thing.
        </p>
        <p className={styles.hint}>
          <span>Narrow this window, or press</span>
          <span className={styles.keys}>
            <kbd>⌘</kbd>
            <kbd>⌥</kbd>
            <kbd>I</kbd>
          </span>
          <span>for device mode.</span>
        </p>
      </div>
    </main>
  );
}
