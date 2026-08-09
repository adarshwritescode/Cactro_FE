# Stories

A mobile-only Instagram Stories experience — a horizontally scrollable tray of reels, a
full-screen viewer with segmented progress bars, tap-to-navigate, and five-second
auto-advance. No external library is used for any of the core functionality: the state
machine, timing, gestures, transitions and preloading are all hand-built on React 19 and
plain CSS.

Desktop viewports get a "switch to mobile" screen. The check is a live media query, so
dragging the window narrow swaps in the real app without a reload.
