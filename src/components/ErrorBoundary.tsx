import React from "react";
import * as Sentry from "@/lib/sentry";

type Props = { children: React.ReactNode };
type State = { hasError: boolean };

export default class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    // send to logging service (Sentry) if initialized
    if (Sentry.isInitialized()) {
      Sentry.captureException(error, info);
    } else {
      // eslint-disable-next-line no-console
      console.error("Uncaught error:", error, info);
    }
  }
  render() {
    if (this.state.hasError) {
      return (
        <div role="alert" className="p-6">
          <h2 className="text-lg font-semibold">Something went wrong.</h2>
          <p className="mt-2">Please refresh the page or contact support if the problem persists.</p>
        </div>
      );
    }
    return this.props.children;
  }
}
