import { ErrorBoundary } from "./shared/components/ErrorBoundary";
import { useMediaQuery } from "./shared/hooks/useMediaQuery";
import { MOBILE_MEDIA_QUERY } from "./features/stories/constants";
import { DesktopNotice } from "./screens/DesktopNotice/DesktopNotice";
import { StoriesScreen } from "./screens/StoriesScreen/StoriesScreen";

/**
 * Composition root: decides which experience to mount and nothing else.
 *
 * The media query is live, so dragging a desktop window narrow (or flipping on
 * device mode) swaps in the real app without a reload.
 */
function App() {
  const isMobileViewport = useMediaQuery(MOBILE_MEDIA_QUERY);

  if (!isMobileViewport) {
    return <DesktopNotice />;
  }

  return (
    <ErrorBoundary
      fallback={(error, reset) => (
        <div className="message" role="alert">
          <p className="message-title">Something went wrong</p>
          <p className="message-body">{error.message}</p>
          <button type="button" className="pill" onClick={reset}>
            Reload stories
          </button>
        </div>
      )}
    >
      <StoriesScreen />
    </ErrorBoundary>
  );
}

export default App;
