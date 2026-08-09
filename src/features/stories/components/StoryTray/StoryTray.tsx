import type { StoryUser } from "../../types";
import styles from "./StoryTray.module.css";

type StoryTrayProps = {
  users: StoryUser[];
  /** Ids whose reel has already been opened — their ring goes grey. */
  seenUserIds: ReadonlySet<string>;
  onSelectUser: (userIndex: number) => void;
};

export function StoryTray({ users, seenUserIds, onSelectUser }: StoryTrayProps) {
  return (
    <ul className={styles.tray} aria-label="Stories">
      {users.map((user, index) => {
        const isSeen = seenUserIds.has(user.id);

        return (
          <li key={user.id} className={styles.item} data-seen={isSeen}>
            <button
              type="button"
              className={styles.ring}
              onClick={() => onSelectUser(index)}
              aria-label={`View ${user.username}'s story, ${user.items.length} items${
                isSeen ? ", already viewed" : ""
              }`}
            >
              <span className={styles.avatarWrapper}>
                <img
                  className={styles.avatar}
                  src={user.avatarUrl}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  draggable={false}
                />
              </span>
            </button>
            <span className={styles.username} aria-hidden="true">
              {user.username}
            </span>
          </li>
        );
      })}
    </ul>
  );
}

/** Same geometry as the real tray, so nothing shifts when the data lands. */
export function StoryTraySkeleton({ count = 5 }: { count?: number }) {
  return (
    <div className={styles.tray} aria-hidden="true">
      {Array.from({ length: count }, (_, index) => (
        <div key={index} className={styles.item}>
          <div className={styles.skeletonRing} />
          <div className={styles.skeletonLabel} />
        </div>
      ))}
    </div>
  );
}
