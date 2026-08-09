import { Component, type ErrorInfo, type ReactNode } from "react";

type ErrorBoundaryProps = {
  children: ReactNode;
  /** Rendered in place of the subtree when it throws. */
  fallback: (error: Error, reset: () => void) => ReactNode;
};

type ErrorBoundaryState = { error: Error | null };

/**
 * The one place a class component is still required — React exposes no hook
 * equivalent for error boundaries.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  override state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error("Unhandled error in stories subtree", error, errorInfo);
  }

  private reset = (): void => {
    this.setState({ error: null });
  };

  override render(): ReactNode {
    const { error } = this.state;
    if (error !== null) {
      return this.props.fallback(error, this.reset);
    }
    return this.props.children;
  }
}
