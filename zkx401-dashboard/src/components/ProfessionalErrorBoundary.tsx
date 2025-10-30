import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCw, Home, Bug, Mail } from 'lucide-react';
import { ErrorInfo as DashboardErrorInfo } from '../types/dashboard';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: ErrorInfo) => void;
  enableRetry?: boolean;
  enableReporting?: boolean;
  showDetails?: boolean;
  level?: 'page' | 'component' | 'widget';
}

interface ExtendedErrorInfo {
  componentStack: string;
  userAgent?: string;
  url?: string;
  sessionId?: string;
  userId?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ExtendedErrorInfo | null;
  errorId: string;
  retryCount: number;
  isRetrying: boolean;
}

export class ProfessionalErrorBoundary extends Component<Props, State> {
  private retryTimeoutId: NodeJS.Timeout | null = null;

  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false,
      error: null,
      errorInfo: null,
      errorId: '',
      retryCount: 0,
      isRetrying: false
    };
  }

  static getDerivedStateFromError(error: Error): Partial<State> {
    return {
      hasError: true,
      error,
      errorId: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    this.setState({
      errorInfo: {
        componentStack: errorInfo.componentStack,
        userAgent: navigator.userAgent,
        url: window.location.href,
        sessionId: this.getSessionId(),
        userId: this.getUserId()
      }
    });

    // Log error for debugging
    console.error('Error Boundary caught an error:', error, errorInfo);

    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }

    // Send to error reporting service if enabled
    if (this.props.enableReporting) {
      this.reportError(error, errorInfo);
    }

    // Auto-retry for certain errors
    if (this.shouldAutoRetry(error)) {
      this.scheduleRetry();
    }
  }

  componentWillUnmount() {
    if (this.retryTimeoutId) {
      clearTimeout(this.retryTimeoutId);
    }
  }

  private getSessionId(): string {
    return sessionStorage.getItem('sessionId') || 
           `session-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  private getUserId(): string | undefined {
    return localStorage.getItem('userId') || undefined;
  }

  private shouldAutoRetry(error: Error): boolean {
    const retryableErrors = [
      'Network Error',
      'fetch',
      'timeout',
      'ECONNRESET',
      'TypeError: Failed to fetch'
    ];

    return retryableErrors.some(retryableError => 
      error.message.includes(retryableError)
    );
  }

  private scheduleRetry() {
    if (this.state.retryCount >= 3) return;

    this.retryTimeoutId = setTimeout(() => {
      this.handleRetry();
    }, 2000 * Math.pow(2, this.state.retryCount)); // Exponential backoff
  }

  private async handleRetry() {
    if (this.state.isRetrying || this.state.retryCount >= 3) return;

    this.setState({
      isRetrying: true,
      retryCount: this.state.retryCount + 1
    });

    // Simulate recovery time
    await new Promise(resolve => setTimeout(resolve, 1000));

    this.setState({
      hasError: false,
      error: null,
      errorInfo: null,
      isRetrying: false
    });
  }

  private async reportError(error: Error, errorInfo: ErrorInfo) {
    try {
      const errorReport = {
        errorId: this.state.errorId,
        message: error.message,
        stack: error.stack,
        componentStack: errorInfo.componentStack,
        timestamp: new Date().toISOString(),
        userAgent: navigator.userAgent,
        url: window.location.href,
        userId: this.getUserId(),
        sessionId: this.getSessionId(),
        level: this.props.level || 'component',
        retryCount: this.state.retryCount
      };

      // Send to error reporting service (implement according to your needs)
      if (process.env.NODE_ENV === 'production') {
        // Example: Send to Sentry, LogRocket, or custom service
        console.log('Reporting error:', errorReport);
        
        // Example implementation:
        // await fetch('/api/errors', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify(errorReport)
        // });
      }
    } catch (reportingError) {
      console.error('Failed to report error:', reportingError);
    }
  }

  private handleReload = () => {
    window.location.reload();
  };

  private handleGoHome = () => {
    window.location.href = '/';
  };

  private handleReportError = () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      url: window.location.href,
      timestamp: new Date().toISOString()
    };

    const mailtoLink = `mailto:support@zkx401.com?subject=Error Report - ${this.state.errorId}&body=${encodeURIComponent(
      JSON.stringify(errorDetails, null, 2)
    )}`;

    window.open(mailtoLink);
  };

  private handleCopyError = async () => {
    const errorDetails = {
      errorId: this.state.errorId,
      message: this.state.error?.message,
      stack: this.state.error?.stack,
      componentStack: this.state.errorInfo?.componentStack,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href
    };

    try {
      await navigator.clipboard.writeText(JSON.stringify(errorDetails, null, 2));
      // You could show a toast notification here
      alert('Error details copied to clipboard');
    } catch (err) {
      console.error('Failed to copy error details:', err);
    }
  };

  render() {
    if (this.state.hasError) {
      // Custom fallback UI
      if (this.props.fallback) {
        return this.props.fallback;
      }

      const isCritical = this.props.level === 'page';
      const maxRetries = 3;
      const canRetry = this.props.enableRetry && this.state.retryCount < maxRetries;

      return (
        <div className={`min-h-screen bg-gray-50 flex items-center justify-center p-6 ${
          isCritical ? '' : 'bg-opacity-50'
        }`}>
          <div className="max-w-2xl w-full">
            {/* Error Card */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-red-500 to-red-600 px-6 py-4">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-6 h-6 text-white" />
                  <div>
                    <h1 className="text-lg font-semibold text-white">
                      {isCritical ? 'Something went wrong' : 'Component Error'}
                    </h1>
                    <p className="text-red-100 text-sm">
                      {isCritical 
                        ? 'We encountered an unexpected error. Our team has been notified.'
                        : 'This component encountered an error but the rest of the app is working fine.'
                      }
                    </p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                {/* Error ID */}
                <div className="mb-4 p-3 bg-gray-50 rounded-lg border">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Error ID:</span>
                    <code className="text-xs font-mono text-gray-600">{this.state.errorId}</code>
                  </div>
                </div>

                {/* Error Message */}
                {this.state.error && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Error Message:</h3>
                    <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-sm text-red-800 font-medium">{this.state.error.message}</p>
                    </div>
                  </div>
                )}

                {/* Stack Trace (if showDetails is enabled) */}
                {this.props.showDetails && this.state.error && this.state.error.stack && (
                  <div className="mb-4">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Stack Trace:</h3>
                    <div className="p-3 bg-gray-900 text-green-400 rounded-lg overflow-auto max-h-40">
                      <pre className="text-xs whitespace-pre-wrap">{this.state.error.stack}</pre>
                    </div>
                  </div>
                )}

                {/* Retry Status */}
                {this.state.isRetrying && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-blue-600 animate-spin" />
                      <span className="text-sm text-blue-800">
                        Retrying... ({this.state.retryCount}/{maxRetries})
                      </span>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3">
                  {canRetry && !this.state.isRetrying && (
                    <button
                      onClick={this.handleRetry}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <RefreshCw className="w-4 h-4" />
                      Try Again
                    </button>
                  )}

                  <button
                    onClick={this.handleReload}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Reload Page
                  </button>

                  {isCritical && (
                    <button
                      onClick={this.handleGoHome}
                      className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      <Home className="w-4 h-4" />
                      Go Home
                    </button>
                  )}

                  <button
                    onClick={this.handleReportError}
                    className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  >
                    <Mail className="w-4 h-4" />
                    Report Error
                  </button>

                  <button
                    onClick={this.handleCopyError}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                  >
                    <Bug className="w-4 h-4" />
                    Copy Details
                  </button>
                </div>

                {/* Additional Info */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">What you can do:</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Try refreshing the page</li>
                    <li>• Check your internet connection</li>
                    <li>• Contact support if the problem persists</li>
                    {canRetry && <li>• The system will automatically retry a few times</li>}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ProfessionalErrorBoundary;