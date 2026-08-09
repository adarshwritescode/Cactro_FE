const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * Compact "just now / 4h / 2d" label for the story header.
 *
 * Uses `Intl.RelativeTimeFormat` (built into the platform) instead of pulling in
 * a date library for three branches.
 */
export function formatRelativeTime(isoTimestamp: string, now: Date = new Date()): string {
  const published = new Date(isoTimestamp);
  const elapsedMs = now.getTime() - published.getTime();

  if (Number.isNaN(elapsedMs)) {
    return "";
  }

  if (elapsedMs < MINUTE_MS) {
    return "just now";
  }

  const formatter = new Intl.RelativeTimeFormat("en", { numeric: "always", style: "narrow" });

  if (elapsedMs < HOUR_MS) {
    return formatter.format(-Math.floor(elapsedMs / MINUTE_MS), "minute");
  }

  if (elapsedMs < DAY_MS) {
    return formatter.format(-Math.floor(elapsedMs / HOUR_MS), "hour");
  }

  return formatter.format(-Math.floor(elapsedMs / DAY_MS), "day");
}
