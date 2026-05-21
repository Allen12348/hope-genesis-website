"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";

type Props = {
  children: React.ReactNode;
  fallbackTitle?: string;
};

type State = { error: Error | null };

export class ErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  render() {
    if (this.state.error) {
      return (
        <div className="mx-auto flex min-h-[40vh] max-w-lg flex-col items-center justify-center gap-4 px-6 py-16 text-center">
          <h2 className="font-display text-xl font-semibold text-foreground">
            {this.props.fallbackTitle ?? "Something went wrong"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Please refresh the page. If the problem continues, contact support.
          </p>
          <Button type="button" variant="outline" className="rounded-xl" onClick={() => window.location.reload()}>
            Refresh page
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
