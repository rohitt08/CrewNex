import React from "react";
import { AlertTriangle, Home, RefreshCw } from "lucide-react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  // eslint-disable-next-line no-unused-vars
  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({ error, errorInfo });
    console.error("ErrorBoundary caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-50 dark:bg-slate-900 flex items-center justify-center p-4 transition-colors duration-300">
          <div className="max-w-md w-full glass-card dark:glass-dark rounded-3xl p-8 border border-white/40 dark:border-white/10 shadow-xl text-center">
            <div className="w-20 h-20 bg-red-50 dark:bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm border border-red-100 dark:border-red-800">
              <AlertTriangle className="w-10 h-10 text-red-500 dark:text-red-400" />
            </div>

            <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-2">
              Something went wrong
            </h1>
            <p className="text-slate-500 dark:text-slate-400 font-medium mb-8">
              An unexpected error occurred in the application. We've logged this
              issue and are looking into it.
            </p>

            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="w-full flex items-center justify-center gap-2 bg-indigo-600 text-white py-3.5 px-6 rounded-xl font-bold shadow-md hover:bg-indigo-700 transition-all hover:-translate-y-0.5"
              >
                <RefreshCw className="w-5 h-5" /> Reload Page
              </button>

              <button
                onClick={() => (window.location.href = "/")}
                className="w-full flex items-center justify-center gap-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 py-3.5 px-6 rounded-xl font-bold shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
              >
                <Home className="w-5 h-5" /> Go to Homepage
              </button>
            </div>

            {import.meta.env.DEV && this.state.error && (
              <div className="mt-8 text-left bg-slate-900 rounded-xl p-4 overflow-auto max-h-40">
                <p className="text-red-400 font-mono text-xs mb-1">
                  {this.state.error.toString()}
                </p>
                <p className="text-slate-400 font-mono text-[10px] whitespace-pre-wrap">
                  {this.state.errorInfo?.componentStack}
                </p>
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
