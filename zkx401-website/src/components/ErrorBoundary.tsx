import { Component, ReactNode } from 'react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: any) {
    console.error('Error boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-background-near-white">
          <div className="text-center p-8">
            <h1 className="text-2xl font-bold text-text-primary mb-4">Something went wrong</h1>
            <p className="text-text-secondary mb-6">We encountered an error while loading the application.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-accent-primary hover:bg-accent-hover text-white px-6 py-3 rounded-md font-semibold transition-all duration-150"
            >
              Reload Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}