import { formatRelativeTime } from "../../utils/formatRelativeTime";
import { useStoryViewerContext } from "./StoryViewerContext";
import styles from "./StoryViewer.module.css";

function CloseIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" focusable="false">
      <path
        d="M4 4 L14 14 M14 4 L4 14"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function StoryHeader() {
  const { story, close } = useStoryViewerContext();
  const { user, item } = story;

  return (
    <div className={styles.header}>
      <img className={styles.headerAvatar} src={user.avatarUrl} alt="" />
      <div className={styles.headerText}>
        <span className={styles.username}>{user.username}</span>
        <time className={styles.timestamp} dateTime={item.publishedAt}>
          {formatRelativeTime(item.publishedAt)}
        </time>
      </div>
      <button type="button" className={styles.closeButton} onClick={close} aria-label="Close story">
        <CloseIcon />
      </button>
    </div>
  );
}
